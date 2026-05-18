const express = require('express');
const router = express.Router();

// Mock Payment Intent API for University Project Demo
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        // Simulate a short delay for the mock payment process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return a mock client secret and a mock success status
        res.send({
            clientSecret: `mock_secret_${Math.random().toString(36).substr(2, 9)}`,
            status: 'succeeded',
            message: 'Mock payment initiated successfully'
        });
    } catch (error) {
        console.error("Error in mock payment API:", error);
        res.status(500).send({ error: "Failed to process mock payment" });
    }
});

module.exports = router;
