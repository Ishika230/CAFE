// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: String,
        phone: String,
    },
    items: [{
        name: String,
        category: String,
        price: Number,
        quantity: Number
    }],
    totalPrice: Number,
    paymentStatus: String, // e.g., 'Pending', 'Completed'
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
