const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')
const DeliveredOrder = require('../models/DeliveredOrders')
// Performance Optimization: Use atomic findOneAndUpdate with upsert: true
// to eliminate 1 sequential DB roundtrip per order submission.
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.splice(0, 0, { 
        order_date: req.body.order_date,
        payment_info: req.body.payment_info 
    });

    const hasDeliveryDate = Boolean(req.body.delivery_date);
    const hasDeliveryTime = Boolean(req.body.delivery_time);

    const updateOps = {
        $push: { order_data: data }
    };

    const setFields = {};
    const setOnInsertFields = {};

    if (hasDeliveryDate) {
        setFields.delivery_date = req.body.delivery_date;
        setFields.delivery_status = 'scheduled';
    } else {
        setOnInsertFields.delivery_date = null;
        setOnInsertFields.delivery_status = 'pending';
    }

    if (hasDeliveryTime) {
        setFields.delivery_time = req.body.delivery_time;
    } else {
        setOnInsertFields.delivery_time = null;
    }

    if (Object.keys(setFields).length > 0) {
        updateOps.$set = setFields;
    }
    if (Object.keys(setOnInsertFields).length > 0) {
        updateOps.$setOnInsert = setOnInsertFields;
    }

    try {
        await Order.findOneAndUpdate(
            { email: req.body.email },
            updateOps,
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});

module.exports = router;

// --- Admin endpoints ---

// Get all orders for admin panel
// Performance Optimization: Append .lean() to bypass Mongoose document hydration.
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).lean();
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Update order delivery schedule and status
router.put('/admin/orders/:id/update', async (req, res) => {
  try {
    const { delivery_date, delivery_time, delivery_status, notification_sent } = req.body;
    
    // Check if the status is being set to 'delivered'
    if (delivery_status === 'delivered') {
        const pendingOrder = await Order.findById(req.params.id);
        if (pendingOrder) {
            // Move to DeliveredOrder collection
            await DeliveredOrder.create({
                email: pendingOrder.email,
                order_data: pendingOrder.order_data,
                delivery_date: pendingOrder.delivery_date || new Date(),
                delivery_time: pendingOrder.delivery_time || "N/A",
                payment_info: pendingOrder.order_data[0][0]?.payment_info
            });
            // Delete from pending orders
            await Order.findByIdAndDelete(req.params.id);
            return res.json({ success: true, message: "Order marked as delivered and moved to archive" });
        }
    }

    const updateData = {};
    if (delivery_date) updateData.delivery_date = delivery_date;
    if (delivery_time) updateData.delivery_time = delivery_time;
    if (delivery_status) updateData.delivery_status = delivery_status;
    if (notification_sent !== undefined) updateData.notification_sent = notification_sent;
    
    // If status is changed but notification_sent is not provided, reset it for new notification
    if (delivery_status && notification_sent === undefined) {
        updateData.notification_sent = false;
    }

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

// Schedule delivery specifically
router.put('/admin/orders/:id/schedule', async (req, res) => {
    try {
        const { delivery_date, delivery_time, delivery_status } = req.body;

        // Automation: If admin schedules and marks as delivered immediately
        if (delivery_status === 'delivered') {
            const pendingOrder = await Order.findById(req.params.id);
            if (pendingOrder) {
                await DeliveredOrder.create({
                    email: pendingOrder.email,
                    order_data: pendingOrder.order_data,
                    delivery_date: delivery_date || pendingOrder.delivery_date || new Date(),
                    delivery_time: delivery_time || pendingOrder.delivery_time || "N/A",
                    payment_info: pendingOrder.order_data[0][0]?.payment_info
                });
                await Order.findByIdAndDelete(req.params.id);
                return res.json({ success: true, message: "Order delivered and archived" });
            }
        }

        const updateData = {
            delivery_date,
            delivery_time,
            delivery_status: delivery_status || 'scheduled',
            notification_sent: false // Reset so user gets a new alert
        };

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

// Admin endpoint for Delivered Orders (List)
// Performance Optimization: Append .lean() to bypass Mongoose document hydration.
router.get('/admin/delivered-orders', async (req, res) => {
    try {
        const deliveredOrders = await DeliveredOrder.find({}).sort({ delivered_at: -1 }).lean();
        res.json(deliveredOrders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// Admin endpoint for Delivered Order (Single)
// Performance Optimization: Append .lean() to bypass Mongoose document hydration.
router.get('/admin/delivered-orders/:id', async (req, res) => {
    try {
        const order = await DeliveredOrder.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// Admin endpoint to delete delivered order (Cleanup)
router.delete('/admin/delivered-orders/:id', async (req, res) => {
    try {
        const order = await DeliveredOrder.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json({ success: true, msg: 'Archived order deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error: ' + error.message);
    }
});



// Performance Optimization: Execute active and delivered order queries concurrently with Promise.all,
// and append .lean() to bypass Mongoose document hydration, reducing response latency and memory overhead.
router.post('/myOrderData', async (req, res) => {
    try {
        const [activeOrder, deliveredOrders] = await Promise.all([
            Order.findOne({ 'email': req.body.email }).lean(),
            DeliveredOrder.find({ 'email': req.body.email }).sort({ delivered_at: -1 }).lean()
        ]);
        
        // Combine active and delivered orders for the frontend
        res.json({ 
            orderData: activeOrder,
            deliveredData: deliveredOrders 
        });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});