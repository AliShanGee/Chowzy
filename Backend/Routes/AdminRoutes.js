const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const FoodCategory = require('../models/FoodCategory');
const Order = require('../models/Orders');

// Helper for sending list response with Content-Range
const sendListResponse = (res, data, total) => {
    res.set('Content-Range', `items 0-${data.length}/${total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
};

const getQueryOptions = (query) => {
    let filter = {};
    if (query.filter) {
        filter = JSON.parse(query.filter);
        if (filter.id) {
            if (Array.isArray(filter.id)) {
                filter._id = { $in: filter.id };
            } else {
                filter._id = filter.id;
            }
            delete filter.id;
        }
    }

    let sort = {};
    if (query.sort) {
        let [field, order] = JSON.parse(query.sort);
        if (field === 'id') field = '_id';
        sort[field] = order === 'ASC' ? 1 : -1;
    }

    let skip = 0;
    let limit = 0;
    if (query.range) {
        const [start, end] = JSON.parse(query.range);
        skip = start;
        limit = end - start + 1;
    }

    return { filter, sort, skip, limit };
};

// --- Food Items ---
router.get('/foodItems', async (req, res) => {
    try {
        const { filter, sort, skip, limit } = getQueryOptions(req.query);
        const data = await FoodItem.find(filter).sort(sort).skip(skip).limit(limit || 0);
        const total = await FoodItem.countDocuments(filter);
        sendListResponse(res, data, total);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/foodItems/:id', async (req, res) => {
    try {
        const item = await FoodItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/foodItems', async (req, res) => {
    try {
        const newItem = new FoodItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/foodItems/:id', async (req, res) => {
    try {
        const updatedItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/foodItems/:id', async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/foodItems', async (req, res) => {
    try {
        const query = req.query;
        if (query.filter) {
            const filter = JSON.parse(query.filter);
            if (filter.id && Array.isArray(filter.id)) {
                await FoodItem.deleteMany({ _id: { $in: filter.id } });
                return res.json(filter.id);
            }
        }
        res.status(400).json({ error: "Invalid delete request" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Food Categories ---
router.get('/foodCategories', async (req, res) => {
    try {
        const { filter, sort, skip, limit } = getQueryOptions(req.query);
        const data = await FoodCategory.find(filter).sort(sort).skip(skip).limit(limit || 0);
        const total = await FoodCategory.countDocuments(filter);
        sendListResponse(res, data, total);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/foodCategories/:id', async (req, res) => {
    try {
        const cat = await FoodCategory.findById(req.params.id);
        if (!cat) return res.status(404).json({ error: "Not found" });
        res.json(cat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/foodCategories', async (req, res) => {
    try {
        const newCat = new FoodCategory(req.body);
        const savedCat = await newCat.save();
        res.status(201).json(savedCat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/foodCategories/:id', async (req, res) => {
    try {
        const updatedCat = await FoodCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/foodCategories/:id', async (req, res) => {
    try {
        await FoodCategory.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/foodCategories', async (req, res) => {
    try {
        const query = req.query;
        if (query.filter) {
            const filter = JSON.parse(query.filter);
            if (filter.id && Array.isArray(filter.id)) {
                await FoodCategory.deleteMany({ _id: { $in: filter.id } });
                return res.json(filter.id);
            }
        }
        res.status(400).json({ error: "Invalid delete request" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Dashboard Stats ---
router.get('/admin/stats', async (req, res) => {
    try {
        const [orders, totalUsers, totalFoodItems, totalCategories] = await Promise.all([
            Order.find({}),
            User.countDocuments({}),
            FoodItem.countDocuments({}),
            FoodCategory.countDocuments({})
        ]);

        const itemSales = {};
        let totalOrders = 0;
        let totalItemsSold = 0;
        let totalRevenue = 0;

        orders.forEach(orderDoc => {
            if (!Array.isArray(orderDoc.order_data)) return;

            orderDoc.order_data.forEach(orderBatch => {
                if (!Array.isArray(orderBatch) || orderBatch.length === 0) return;

                totalOrders += 1;

                orderBatch.forEach(item => {
                    if (!item || !item.name || item.order_date) return;

                    const quantity = parseInt(item.qty, 10) || 0;
                    const price = parseFloat(String(item.price || 0).replace(/[^0-9.-]+/g, '')) || 0;

                    if (!itemSales[item.name]) {
                        itemSales[item.name] = {
                            name: item.name,
                            value: 0,
                            revenue: 0
                        };
                    }

                    itemSales[item.name].value += quantity;
                    itemSales[item.name].revenue += quantity * price;

                    totalItemsSold += quantity;
                    totalRevenue += quantity * price;
                });
            });
        });

        const pieChartData = Object.values(itemSales)
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const topSellingItems = Object.values(itemSales)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        res.json({
            summary: {
                totalUsers,
                totalFoodItems,
                totalCategories,
                totalOrders,
                totalItemsSold,
                totalRevenue: Number(totalRevenue.toFixed(2))
            },
            pieChartData,
            topSellingItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const User = require('../models/User');

// --- Users ---
router.get('/users', async (req, res) => {
    try {
        const { filter, sort, skip, limit } = getQueryOptions(req.query);
        const data = await User.find(filter).sort(sort).skip(skip).limit(limit || 0);
        const total = await User.countDocuments(filter);
        sendListResponse(res, data, total);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/users/:id', async (req, res) => {
    try {
        const item = await User.findById(req.params.id);
        res.json(item || {});
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/users/:id', async (req, res) => {
    try {
        const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users', async (req, res) => {
    try {
        const query = req.query;
        if (query.filter) {
            const filter = JSON.parse(query.filter);
            if (filter.id && Array.isArray(filter.id)) {
                await User.deleteMany({ _id: { $in: filter.id } });
                return res.json(filter.id);
            }
        }
        res.status(400).json({ error: "Invalid delete request" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Orders ---
router.get('/admin/orders', async (req, res) => {
    try {
        const { filter, sort, skip, limit } = getQueryOptions(req.query);
        const data = await Order.find(filter).sort(sort).skip(skip).limit(limit || 0);
        const total = await Order.countDocuments(filter);
        sendListResponse(res, data, total);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/admin/orders/:id', async (req, res) => {
    try {
        const item = await Order.findById(req.params.id);
        res.json(item || {});
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/admin/orders/:id', async (req, res) => {
    try {
        const updatedItem = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/admin/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/admin/orders', async (req, res) => {
    try {
        const query = req.query;
        if (query.filter) {
            const filter = JSON.parse(query.filter);
            if (filter.id && Array.isArray(filter.id)) {
                await Order.deleteMany({ _id: { $in: filter.id } });
                return res.json(filter.id);
            }
        }
        res.status(400).json({ error: "Invalid delete request" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
