// controllers/orderController.js
const Order = require('../models/orderModel');

const handleOrderCheckout = async (req, res) => {
    try {
        const { customer, items, paymentStatus } = req.body;
        const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const newOrder = new Order({
            customer,
            items,
            totalPrice,
            paymentStatus
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { handleOrderCheckout };
