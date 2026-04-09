import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ChatHistory from './ChatHistory.js';
import API_BASE_URL from '../config';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { user: false, message: 'Hello! I\'m your food assistant. I can help with food ingredients, diet tips, and healthy eating. Here are some suggestions:\n- Ask about ingredients in our dishes\n- Get diet recommendations\n- Learn about healthy food options\n- Select a food item to know more' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [position, setPosition] = useState('right'); // 'left' or 'right'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/foodData`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setFoodItems(data[0]); // food items
        }
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    };
    fetchFoodData();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { user: true, message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const foodList = foodItems.map(item => `${item.name}: ${item.description || 'Delicious food item'}`).join(', ');
      const systemPrompt = `You are a helpful food assistant for a food delivery app. Answer questions related to food ingredients, diet, health, and nutrition. Do not give personal advice or use "@" in responses. Focus on general information about food. Available food items: ${foodList}. User question: ${input}`;

      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: systemPrompt }),
      });
      const data = await response.json();
      const botMessage = { user: false, message: data.response || 'Sorry, I couldn\'t fetch a response.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { user: false, message: 'Sorry, I\'m having trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const moveLeft = () => {
    setPosition('left');
  };

  const moveRight = () => {
    setPosition('right');
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        [position]: '20px',
        width: '350px',
        height: '500px',
        backgroundColor: '#f5f8fb',
        border: '1px solid #ccc',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        fontFamily: 'Helvetica Neue',
        transition: 'right 0.3s ease, left 0.3s ease'
      }}>
        <div style={{
          backgroundColor: '#EF6C00',
          color: '#fff',
          padding: '10px',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo192.png" alt="Logo" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
            <span>Food Assistant</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="link" onClick={moveLeft} style={{ color: '#fff', padding: '0 5px' }}>
              <FiChevronLeft size={20} />
            </Button>
            <Button variant="link" onClick={moveRight} style={{ color: '#fff', padding: '0 5px' }}>
              <FiChevronRight size={20} />
            </Button>
            <Button variant="link" onClick={() => setShowHistory(true)} style={{ color: '#fff', padding: 0 }}>
              History
            </Button>
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ListGroup variant="flush">
            {messages.map((msg, index) => (
              <ListGroup.Item key={index} style={{
                backgroundColor: msg.user ? '#fff' : '#EF6C00',
                color: msg.user ? '#4a4a4a' : '#fff',
                borderRadius: '10px',
                marginBottom: '5px',
                alignSelf: msg.user ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                whiteSpace: 'pre-line'
              }}>
                {msg.message}
              </ListGroup.Item>
            ))}
            {loading && (
              <ListGroup.Item style={{
                backgroundColor: '#EF6C00',
                color: '#fff',
                borderRadius: '10px',
                marginBottom: '5px',
                alignSelf: 'flex-start',
                maxWidth: '80%',
                animation: 'pulse 1.5s infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>🤔 Thinking...</span>
                  <div style={{ marginLeft: '10px', display: 'flex' }}>
                    <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                    <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></div>
                    <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></div>
                  </div>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
          <div ref={messagesEndRef} />
        </div>
        <div style={{
          padding: '10px',
          borderTop: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex' }}>
            <Form.Control
              type="text"
              placeholder="Ask about food, ingredients, diet..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button onClick={handleSend} disabled={loading} style={{ backgroundColor: '#EF6C00', borderColor: '#EF6C00' }}>
              Send
            </Button>
          </div>
        </div>
        <ChatHistory
          show={showHistory}
          handleClose={() => setShowHistory(false)}
          chatHistory={messages}
        />
      </div>
    </>
  );
};

export default Chatbot;