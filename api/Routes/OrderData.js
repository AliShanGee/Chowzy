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
                order_data: [data],
                delivery_date: req.body.delivery_date || null,
                delivery_time: req.body.delivery_time || null,
                delivery_status: req.body.delivery_date ? 'scheduled' : 'pending'
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
                { 
                    $push: { order_data: data },
                    ...(req.body.delivery_date && { delivery_date: req.body.delivery_date }),
                    ...(req.body.delivery_time && { delivery_time: req.body.delivery_time }),
                    ...(req.body.delivery_date && { delivery_status: 'scheduled' })
                }
            );
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    }
});

module.exports = router;

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

// Update order delivery schedule
router.put('/admin/orders/:id/schedule', async (req, res) => {
  try {
    const { delivery_date, delivery_time, delivery_status } = req.body;
    const updateData = {};
    if (delivery_date) updateData.delivery_date = delivery_date;
    if (delivery_time) updateData.delivery_time = delivery_time;
    if (delivery_status) updateData.delivery_status = delivery_status;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error: ' + error.message);
  }
});



router.post('/myOrderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email });
        res.json({ orderData: myData });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});