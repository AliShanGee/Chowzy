const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const User = require('../models/User');
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const { client } = require('../redis');

// Get all reels for users with Redis caching and safety timeout
router.get('/getreels', async (req, res) => {
    try {
        let cachedReels = null;
        
        // Use a timeout for Redis operations so they don't hang the request
        if (isNode && client && client.isOpen) {
            try {
                cachedReels = await Promise.race([
                    client.get('all_reels'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
                ]);
            } catch (redisErr) {
                // Silenced Redis fetch timeout to avoid log noise
            }
        }

        if (cachedReels) {
            return res.json({ success: true, reels: JSON.parse(cachedReels), source: 'cache' });
        }

        const reels = await Reel.find({}).sort({ date: -1 });
        
        if (isNode && client && client.isOpen) {
            try {
                await Promise.race([
                    client.set('all_reels', JSON.stringify(reels), { EX: 3600 }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
                ]);
            } catch (redisErr) {
                // Silenced Redis set timeout to avoid log noise
            }
        }

        res.json({ success: true, reels, source: 'db' });
    } catch (error) {
        console.error('Reel fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Like a reel (also invalidates cache)
router.post('/reels/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        const index = reel.likes.indexOf(userId);
        if (index === -1) {
            reel.likes.push(userId);
        } else {
            reel.likes.splice(index, 1);
        }
        await reel.save();

        // Invalidate Redis cache
        if (isNode && client && client.isOpen) {
            try {
                await Promise.race([
                    client.del('all_reels'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
                ]);
            } catch (redisErr) {
                // Silenced Redis del timeout
            }
        }

        res.json({ success: true, likes: reel.likes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save a reel
router.post('/reels/:id/save', async (req, res) => {
    try {
        const { userId } = req.body;
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        const index = reel.saves.indexOf(userId);
        if (index === -1) {
            reel.saves.push(userId);
        } else {
            reel.saves.splice(index, 1);
        }
        await reel.save();
        res.json({ success: true, saves: reel.saves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
