const express = require('express');
const { Annotation, END, START, StateGraph } = require('@langchain/langgraph');
const FoodItem = require('../models/FoodItem');
const { isNode } = require('../redis');

const router = express.Router();

if (isNode) {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
  require('dotenv').config();
}

const SUPPORTED_INTENTS = [
  'greeting',
  'list_menu',
  'price',
  'price_range',
  'ingredients',
  'category',
  'item_details',
  'general_food_qa',
  'recommendation',
  'app_help',
  'out_of_scope',
];

const ZAI_BASE_URL = process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4';
const MODEL_CANDIDATES = [
  process.env.ZAI_MODEL,
  'glm-5.1',
  'glm-4.6',
].filter(Boolean);

let activeModelName = MODEL_CANDIDATES[0] || null;
let globalAiCooldownUntil = 0;

const FoodAssistantState = Annotation.Root({
  prompt: Annotation(),
  classification: Annotation(),
  menuItems: Annotation(),
  matchedItem: Annotation(),
  matchedItems: Annotation(),
  response: Annotation(),
});

function normalizeText(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function hasNonEmptyText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getPrimaryOptionMap(foodItem) {
  if (!foodItem?.options) return {};
  if (Array.isArray(foodItem.options)) {
    return foodItem.options[0] && typeof foodItem.options[0] === 'object' ? foodItem.options[0] : {};
  }
  return typeof foodItem.options === 'object' ? foodItem.options : {};
}

function isUsableFoodItem(foodItem) {
  return hasNonEmptyText(foodItem?.name) && hasNonEmptyText(foodItem?.CategoryName);
}

function safeParseJson(rawText, fallbackValue) {
  if (!rawText) return fallbackValue;

  try {
    return JSON.parse(rawText);
  } catch (error) {
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      try {
        return JSON.parse(rawText.slice(startIndex, endIndex + 1));
      } catch (nestedError) {
        return fallbackValue;
      }
    }

    return fallbackValue;
  }
}

function parseRetryDelayMs(error) {
  const message = error?.message || '';
  const retryAfter = Number(error?.retryAfterMs);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter;
  }

  const retryMatch = message.match(/retry(?:\s+after|\s+in)?\s+([\d.]+)\s*s/i);
  if (retryMatch) {
    return Math.ceil(Number(retryMatch[1]) * 1000);
  }

  return 60 * 1000;
}

function isQuotaError(error) {
  return [429, 503].includes(error?.status) || /quota|rate limit|too many requests/i.test(error?.message || '');
}

function getGlobalCooldownMs() {
  return Math.max(0, globalAiCooldownUntil - Date.now());
}

function formatSeconds(ms) {
  return Math.max(1, Math.ceil(ms / 1000));
}

async function invokeZaiChat(messages, options = {}) {
  if (!process.env.ZAI_API_KEY) {
    return null;
  }

  const globalCooldownMs = getGlobalCooldownMs();
  if (globalCooldownMs > 0) {
    const cooldownError = new Error(`Z.AI is temporarily paused. Retry in ${formatSeconds(globalCooldownMs)}s.`);
    cooldownError.code = 'ZAI_RATE_LIMITED';
    cooldownError.retryAfterMs = globalCooldownMs;
    throw cooldownError;
  }

  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node.js runtime.');
  }

  const candidateModels = [...new Set([activeModelName, ...MODEL_CANDIDATES].filter(Boolean))];
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const response = await fetch(`${ZAI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.ZAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          stream: false,
          temperature: options.temperature ?? 0.2,
          messages,
        }),
      });

      const rawBody = await response.text();
      const data = rawBody ? safeParseJson(rawBody, null) : null;

      if (!response.ok) {
        const error = new Error(data?.error?.message || data?.message || `Z.AI request failed with ${response.status}`);
        error.status = response.status;
        const retryAfterHeader = response.headers.get('retry-after');
        if (retryAfterHeader && !Number.isNaN(Number(retryAfterHeader))) {
          error.retryAfterMs = Number(retryAfterHeader) * 1000;
        }
        throw error;
      }

      activeModelName = modelName;
      return data?.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      lastError = error;

      if (isQuotaError(error)) {
        const retryDelayMs = parseRetryDelayMs(error);
        globalAiCooldownUntil = Date.now() + retryDelayMs;
      }

      console.warn(`Z.AI fallback from "${modelName}": ${error.message}`);
    }
  }

  throw lastError || new Error('Z.AI request failed.');
}

function keywordFallbackClassification(prompt) {
  const normalizedPrompt = normalizeText(prompt);
  const foodWords = [
    'food',
    'dish',
    'meal',
    'menu',
    'pizza',
    'burger',
    'biryani',
    'rice',
    'dessert',
    'paneer',
    'chicken',
  ];
  const greetingWords = ['hi', 'hello', 'hey', 'hola', 'namaste'];
  const isGreeting = greetingWords.some((word) => normalizedPrompt === word || normalizedPrompt.startsWith(`${word} `));
  const mentionsMenu = /\b(menu|all food|all items|list|show dishes|what do you have)\b/.test(normalizedPrompt);
  const asksPrice = /\b(price|cost|how much)\b/.test(normalizedPrompt);
  const hasNumber = /\b\d{2,5}\b/.test(normalizedPrompt);
  const asksPriceRange = /\b(between|under|below|less than|above|greater than|more than|within|budget|around|near|only)\b/.test(normalizedPrompt)
    && hasNumber;
  const asksBudgetBySinglePrice = asksPrice && hasNumber;
  const asksIngredients = /\b(ingredient|ingredients|made of|contains)\b/.test(normalizedPrompt);
  const asksCategory = /\b(category|where can i find|which section|which category)\b/.test(normalizedPrompt);
  const asksRecommendation = /\b(recommend|suggest|best|popular)\b/.test(normalizedPrompt);
  const asksAppHelp = /\b(order|cart|delivery|payment|checkout)\b/.test(normalizedPrompt);
  const isFoodRelated = foodWords.some((word) => normalizedPrompt.includes(word));
  const asksFoodKnowledge = /\b(who|invented|origin|history|famous|why|benefits|healthy|unhealthy)\b/.test(normalizedPrompt) && isFoodRelated;
  const asksAiKnowledge = /\b(ai|artificial intelligence|machine learning|llm|chatbot|model)\b/.test(normalizedPrompt);
  const numbers = normalizedPrompt.match(/\d{2,5}/g) || [];
  let minPrice = null;
  let maxPrice = null;

  if (asksPriceRange || asksBudgetBySinglePrice) {
    if (/\bunder|below|less than\b/.test(normalizedPrompt) && numbers[0]) {
      maxPrice = Number(numbers[0]);
    } else if (/\babove|greater than|more than\b/.test(normalizedPrompt) && numbers[0]) {
      minPrice = Number(numbers[0]);
    } else if (asksBudgetBySinglePrice && numbers[0]) {
      maxPrice = Number(numbers[0]);
    } else if (numbers.length >= 2) {
      minPrice = Number(numbers[0]);
      maxPrice = Number(numbers[1]);
    }
  }

  let intent = 'item_details';
  if (isGreeting) intent = 'greeting';
  else if (mentionsMenu) intent = 'list_menu';
  else if (asksPriceRange || asksBudgetBySinglePrice) intent = 'price_range';
  else if (asksPrice) intent = 'price';
  else if (asksIngredients) intent = 'ingredients';
  else if (asksCategory) intent = 'category';
  else if (asksFoodKnowledge || asksAiKnowledge) intent = 'general_food_qa';
  else if (asksRecommendation) intent = 'recommendation';
  else if (asksAppHelp) intent = 'app_help';
  else if (!isFoodRelated && !asksAiKnowledge) intent = 'out_of_scope';

  const stopWords = new Set([
    'what',
    'is',
    'the',
    'price',
    'of',
    'how',
    'much',
    'ingredients',
    'ingredient',
    'in',
    'for',
    'tell',
    'me',
    'about',
    'where',
    'can',
    'i',
    'find',
    'which',
    'category',
    'show',
    'list',
    'menu',
    'best',
    'suggest',
    'recommend',
    'please',
    'food',
    'dish',
  ]);

  const itemHint = normalizedPrompt
    .split(' ')
    .filter((word) => word && !stopWords.has(word))
    .join(' ')
    .trim();

  const itemName = itemHint && !/^\d+$/.test(itemHint) ? itemHint : null;

  return {
    intent,
    itemName,
    categoryName: null,
    minPrice,
    maxPrice,
    needsMenuSearch: !['greeting', 'out_of_scope', 'general_food_qa'].includes(intent),
  };
}

function getFoodItemPrices(foodItem) {
  const optionMap = getPrimaryOptionMap(foodItem);

  return Object.entries(optionMap)
    .map(([, value]) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function filterFoodItemsByPrice(menuItems, classification) {
  const minPrice = Number.isFinite(classification.minPrice) ? classification.minPrice : null;
  const maxPrice = Number.isFinite(classification.maxPrice) ? classification.maxPrice : null;

  return menuItems.filter((item) => {
    const prices = getFoodItemPrices(item);
    if (!prices.length) return false;

    return prices.some((price) => {
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;
      return true;
    });
  });
}

function scoreFoodItem(foodItem, prompt, classification) {
  if (!isUsableFoodItem(foodItem)) return -1;

  const normalizedPrompt = normalizeText(prompt);
  const normalizedName = normalizeText(foodItem.name);
  const normalizedCategory = normalizeText(foodItem.CategoryName);
  const normalizedDescription = normalizeText(foodItem.description);
  const itemHint = normalizeText(classification.itemName || '');
  const categoryHint = normalizeText(classification.categoryName || '');
  let score = 0;

  if (itemHint && normalizedName.includes(itemHint)) score += 12;
  if (itemHint && itemHint.split(' ').every((word) => normalizedName.includes(word))) score += 8;
  if (normalizedPrompt.includes(normalizedName)) score += 14;
  if (normalizedPrompt.includes(normalizedCategory)) score += 6;
  if (categoryHint && normalizedCategory.includes(categoryHint)) score += 10;

  const promptWords = normalizedPrompt.split(' ').filter((word) => word.length > 2);
  for (const word of promptWords) {
    if (normalizedName.includes(word)) score += 3;
    if (normalizedCategory.includes(word)) score += 2;
    if (normalizedDescription.includes(word)) score += 1;
  }

  return score;
}

function findBestMatch(menuItems, prompt, classification) {
  if (!Array.isArray(menuItems) || menuItems.length === 0) return null;

  const rankedItems = menuItems
    .map((item) => ({
      item,
      score: scoreFoodItem(item, prompt, classification),
    }))
    .sort((left, right) => right.score - left.score);

  if (!rankedItems[0] || rankedItems[0].score < 6) {
    return null;
  }

  return rankedItems[0].item;
}

function formatPriceOptions(foodItem) {
  const optionMap = getPrimaryOptionMap(foodItem);
  const entries = Object.entries(optionMap)
    .map(([label, value]) => [label, Number(value)])
    .filter(([, value]) => Number.isFinite(value));

  if (!entries.length) return 'Price is not available right now.';

  return entries
    .map(([label, value]) => `${label}: Rs. ${value}`)
    .join(', ');
}

function buildMenuSnapshot(menuItems) {
  const validItems = menuItems.filter(isUsableFoodItem);
  const categories = [...new Set(validItems.map((item) => item.CategoryName).filter(Boolean))];
  const sampleItems = validItems.slice(0, 12).map((item) => item.name);

  return {
    totalItems: validItems.length,
    categories,
    sampleItems,
  };
}

function buildLocalGeneralKnowledgeReply(prompt) {
  const normalizedPrompt = normalizeText(prompt);

  if (/\bwho\b/.test(normalizedPrompt) && /\binvent(ed)?\b/.test(normalizedPrompt) && /\bmix(ed)? veg(etable)? pizza\b/.test(normalizedPrompt)) {
    return 'Mixed veg pizza does not have one known inventor. Pizza itself developed in Naples, Italy, and vegetable-topped versions evolved later as restaurants created vegetarian variations.';
  }

  if (/\bwho\b/.test(normalizedPrompt) && /\binvent(ed)?\b/.test(normalizedPrompt) && /\bpizza\b/.test(normalizedPrompt)) {
    return 'Pizza was not invented by one single modern person, but the pizza style we know today was developed in Naples, Italy. The Margherita is often linked to late 19th-century Neapolitan pizza makers.';
  }

  if (/\bwhat\b/.test(normalizedPrompt) && /\bai|artificial intelligence\b/.test(normalizedPrompt)) {
    return 'AI means artificial intelligence: software designed to perform tasks that usually need human-like understanding, such as answering questions, recognizing patterns, generating text, or making predictions.';
  }

  if (/\bwhat\b/.test(normalizedPrompt) && /\bllm|large language model\b/.test(normalizedPrompt)) {
    return 'An LLM is a large language model trained on a lot of text so it can understand prompts and generate natural-language responses.';
  }

  if (/\borigin|history\b/.test(normalizedPrompt) && /\bpizza\b/.test(normalizedPrompt)) {
    return 'Modern pizza traces back to Naples, Italy, where flatbreads with tomato, cheese, and other toppings became popular before spreading worldwide.';
  }

  return 'I can answer basic food-history and AI questions here. Try prompts like "What is AI?", "Who invented pizza?", or "What is the origin of biryani?"';
}

function normalizeClassification(classification, prompt) {
  const normalizedPrompt = normalizeText(prompt);
  const numbers = normalizedPrompt.match(/\d{2,5}/g) || [];
  const hasPriceKeyword = /\b(price|cost|how much|budget|under|below|above|between|within|around|near|only)\b/.test(normalizedPrompt);
  const itemName = hasNonEmptyText(classification?.itemName) && !/^\d+$/.test(classification.itemName.trim())
    ? classification.itemName.trim()
    : null;

  let intent = classification?.intent || 'item_details';
  let minPrice = Number.isFinite(Number(classification?.minPrice)) ? Number(classification.minPrice) : null;
  let maxPrice = Number.isFinite(Number(classification?.maxPrice)) ? Number(classification.maxPrice) : null;

  if (hasPriceKeyword && numbers.length && !itemName) {
    intent = 'price_range';
    if (/\babove|greater than|more than\b/.test(normalizedPrompt)) {
      minPrice = Number(numbers[0]);
      maxPrice = null;
    } else if (numbers.length >= 2) {
      minPrice = Number(numbers[0]);
      maxPrice = Number(numbers[1]);
    } else {
      minPrice = null;
      maxPrice = Number(numbers[0]);
    }
  }

  return {
    ...classification,
    intent,
    itemName,
    minPrice,
    maxPrice,
    needsMenuSearch: !['greeting', 'out_of_scope', 'general_food_qa'].includes(intent),
  };
}

function buildTemporaryAiUnavailableReply(state, error) {
  const intent = state.classification?.intent || 'item_details';
  const retryAfterMs = error?.retryAfterMs || parseRetryDelayMs(error);
  const retryText = `AI is temporarily busy. Please try again in about ${formatSeconds(retryAfterMs)} seconds.`;

  if (intent === 'general_food_qa') {
    return `${buildLocalGeneralKnowledgeReply(state.prompt)} ${retryText}`.trim();
  }

  return `${buildGroundedReply(state)} ${retryText}`.trim();
}

async function classifyQuery(state) {
  const fallback = keywordFallbackClassification(state.prompt);

  if (!process.env.ZAI_API_KEY) {
    return { classification: fallback };
  }

  try {
    const result = await invokeZaiChat(
      [
        {
          role: 'system',
          content:
            'You classify food delivery assistant messages. Return only valid JSON with keys: intent, itemName, categoryName, minPrice, maxPrice, needsMenuSearch. ' +
            `Allowed intents: ${SUPPORTED_INTENTS.join(', ')}. ` +
            'Treat AI questions and food knowledge questions as general_food_qa. Treat unrelated topics as out_of_scope.',
        },
        {
          role: 'user',
          content: `User message: "${state.prompt}"`,
        },
      ],
      { temperature: 0 }
    );

    const parsed = safeParseJson(result, fallback);
    const intent = SUPPORTED_INTENTS.includes(parsed.intent) ? parsed.intent : fallback.intent;

    return {
      classification: normalizeClassification({
        intent,
        itemName: parsed.itemName || fallback.itemName || null,
        categoryName: parsed.categoryName || null,
        minPrice: Number.isFinite(Number(parsed.minPrice)) ? Number(parsed.minPrice) : fallback.minPrice,
        maxPrice: Number.isFinite(Number(parsed.maxPrice)) ? Number(parsed.maxPrice) : fallback.maxPrice,
        needsMenuSearch:
          typeof parsed.needsMenuSearch === 'boolean' ? parsed.needsMenuSearch : fallback.needsMenuSearch,
      }, state.prompt),
    };
  } catch (error) {
    console.warn('Food assistant classification fallback:', error.message);
    return { classification: normalizeClassification(fallback, state.prompt) };
  }
}

async function loadMenuContext(state) {
  const classification = state.classification || keywordFallbackClassification(state.prompt);

  if (!classification.needsMenuSearch) {
    return {
      menuItems: [],
      matchedItem: null,
      matchedItems: [],
    };
  }

  const menuItems = (await FoodItem.find({}).lean()).filter(isUsableFoodItem);
  const matchedItem = findBestMatch(menuItems, state.prompt, classification);
  const matchedItems = classification.intent === 'price_range'
    ? filterFoodItemsByPrice(menuItems, classification)
    : [];

  return {
    menuItems,
    matchedItem,
    matchedItems,
  };
}

function buildGroundedReply(state) {
  const classification = state.classification || {};
  const intent = classification.intent || 'item_details';
  const menuItems = state.menuItems || [];
  const matchedItem = state.matchedItem;
  const matchedItems = state.matchedItems || [];
  const menuSnapshot = buildMenuSnapshot(menuItems);

  if (intent === 'greeting') {
    return (
      "Hello! I'm your food assistant. Ask me about menu items, prices, ingredients, categories, recommendations, or AI basics."
    );
  }

  if (intent === 'out_of_scope') {
    return (
      'I can help with food app questions, menu items, prices, ingredients, ordering help, and basic AI-related questions.'
    );
  }

  if (intent === 'general_food_qa') {
    return buildLocalGeneralKnowledgeReply(state.prompt);
  }

  if (intent === 'list_menu') {
    const categoriesText = menuSnapshot.categories.length
      ? `Categories: ${menuSnapshot.categories.join(', ')}.`
      : '';
    const sampleItemsText = menuSnapshot.sampleItems.length
      ? `Some items: ${menuSnapshot.sampleItems.join(', ')}.`
      : '';

    return `We currently have ${menuSnapshot.totalItems} menu items. ${categoriesText} ${sampleItemsText}`.trim();
  }

  if (intent === 'recommendation') {
    const topRatedItems = [...menuItems]
      .sort((left, right) => (right.rating || 0) - (left.rating || 0))
      .slice(0, 3)
      .map((item) => item.name);

    if (topRatedItems.length) {
      return `You can try ${topRatedItems.join(', ')}. If you want, ask me for price or ingredients for any one of them.`;
    }

    return 'I can recommend dishes once the menu items are available. You can also ask me to list the menu.';
  }

  if (intent === 'price_range') {
    if (!matchedItems.length) {
      const minText = Number.isFinite(classification.minPrice) ? `from Rs. ${classification.minPrice}` : '';
      const maxText = Number.isFinite(classification.maxPrice) ? `up to Rs. ${classification.maxPrice}` : '';
      return `I couldn't find menu items ${[minText, maxText].filter(Boolean).join(' ')}. Try another budget range.`;
    }

    const limitedItems = matchedItems
      .slice(0, 10)
      .map((item) => `${item.name} (${formatPriceOptions(item)})`);
    return `Here are all matching food items: ${limitedItems.join(', ')}.`;
  }

  if (intent === 'app_help') {
    return 'I can help you explore food items, prices, ingredients, and categories. For ordering, add an item to cart and continue to checkout in the app.';
  }

  if (!matchedItem) {
    return 'I could not find that item in the menu right now. Try asking about Pizza, Biryani, Burger, or ask me to list the menu.';
  }

  if (intent === 'price') {
    return `${matchedItem.name} is available in the ${matchedItem.CategoryName} category. Prices: ${formatPriceOptions(matchedItem)}.`;
  }

  if (intent === 'ingredients') {
    return `${matchedItem.name} ingredients/details: ${matchedItem.description}.`;
  }

  if (intent === 'category') {
    return `${matchedItem.name} is available in our ${matchedItem.CategoryName} category.`;
  }

  return `${matchedItem.name} is in the ${matchedItem.CategoryName} category. Details: ${matchedItem.description}. Prices: ${formatPriceOptions(matchedItem)}.`;
}

async function writeReply(state) {
  const deterministicReply = buildGroundedReply(state);

  if (!process.env.ZAI_API_KEY) {
    return { response: deterministicReply };
  }

  try {
    const promptData = {
      intent: state.classification?.intent || null,
      userQuestion: state.prompt,
      matchedItem: state.matchedItem
        ? {
            name: state.matchedItem.name,
            category: state.matchedItem.CategoryName,
            description: state.matchedItem.description,
            prices: state.matchedItem.options?.[0] || {},
          }
        : null,
      categories: [...new Set((state.menuItems || []).map((item) => item.CategoryName).filter(Boolean))],
      totalItems: (state.menuItems || []).length,
      matchedItems: (state.matchedItems || []).slice(0, 10).map((item) => ({
        name: item.name,
        category: item.CategoryName,
        description: item.description,
        prices: getPrimaryOptionMap(item),
      })),
      fallbackAnswer: deterministicReply,
    };

    const result = await invokeZaiChat([
      {
        role: 'system',
        content:
          'You are a food delivery app assistant. ' +
          'Answer AI-related questions and food-knowledge questions clearly. ' +
          'For menu-related intents, answer only from the provided menu context. ' +
          'If the intent is price_range, return a list of all matching food items instead of focusing on one item. ' +
          'Keep replies friendly, concise, and practical. If the item is not found, say so politely and redirect to menu-related questions.',
      },
      {
        role: 'user',
        content: `Use this data to answer the user:\n${JSON.stringify(promptData, null, 2)}`,
      },
    ]);

    return { response: result || deterministicReply };
  } catch (error) {
    console.warn('Food assistant response fallback:', error.message);
    if (isQuotaError(error) || error?.code === 'ZAI_RATE_LIMITED') {
      return { response: buildTemporaryAiUnavailableReply(state, error) };
    }
    return { response: deterministicReply };
  }
}

const foodAssistantGraph = new StateGraph(FoodAssistantState)
  .addNode('classify_query', classifyQuery)
  .addNode('load_menu_context', loadMenuContext)
  .addNode('write_reply', writeReply)
  .addEdge(START, 'classify_query')
  .addEdge('classify_query', 'load_menu_context')
  .addEdge('load_menu_context', 'write_reply')
  .addEdge('write_reply', END)
  .compile();

router.post('/ask', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await foodAssistantGraph.invoke({ prompt });
    return res.json({ response: result.response });
  } catch (error) {
    console.error('Food assistant route error:', error);
    return res.status(500).json({
      error: 'Unable to process your question right now.',
      details: error.message,
    });
  }
});

module.exports = router;
