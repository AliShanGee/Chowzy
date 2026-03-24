const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')
router.post('/orderData',async (req,res)=>{
    let data = req.body.order_data;
    data.splice(0, 0, { order_date: req.body.order_date });

    let eId = await Order.findOne({ 'email': req.body.email });

    if (eId === null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    } else {
        try {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    }
});

// --- Admin endpoints ---

// Get all orders for admin panel
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error: ' + error.message);
  }
});

module.exports = router;