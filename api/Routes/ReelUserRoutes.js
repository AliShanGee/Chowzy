const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const User = require('../models/User');
const { client } = require('../redis');

// Get all reels for users with Redis caching and safety timeout
router.get('/getreels', async (req, res) => {
    try {
        let cachedReels = null;
        
        // Use a timeout for Redis operations so they don't hang the request
        if (client.isOpen) {
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

        // Bolt Optimization: Append .lean() to bypass Mongoose document hydration overhead
        const reels = await Reel.find({}).sort({ date: -1 }).lean();
        
        if (client.isOpen) {
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
        // Bolt Optimization: Fetch lightweight lean object with only required field
        const reel = await Reel.findById(req.params.id).select('likes').lean();
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        const likes = reel.likes || [];
        const hasLiked = likes.some(id => id.toString() === userId.toString());

        // Bolt Optimization: Atomic MongoDB update avoiding full document hydration and saves
        const updatedReel = await Reel.findByIdAndUpdate(
            req.params.id,
            hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
            { new: true, select: 'likes' }
        ).lean();

        // Invalidate Redis cache
        if (client.isOpen) {
            try {
                await Promise.race([
                    client.del('all_reels'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
                ]);
            } catch (redisErr) {
                // Silenced Redis del timeout
            }
        }

        res.json({ success: true, likes: updatedReel ? updatedReel.likes : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save a reel
router.post('/reels/:id/save', async (req, res) => {
    try {
        const { userId } = req.body;
        // Bolt Optimization: Fetch lightweight lean object with only required field
        const reel = await Reel.findById(req.params.id).select('saves').lean();
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        const saves = reel.saves || [];
        const hasSaved = saves.some(id => id.toString() === userId.toString());

        // Bolt Optimization: Atomic MongoDB update avoiding full document hydration and saves
        const updatedReel = await Reel.findByIdAndUpdate(
            req.params.id,
            hasSaved ? { $pull: { saves: userId } } : { $addToSet: { saves: userId } },
            { new: true, select: 'saves' }
        ).lean();

        res.json({ success: true, saves: updatedReel ? updatedReel.saves : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
