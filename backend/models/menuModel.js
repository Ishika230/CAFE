const mongoose = require('mongoose');

// Define the Menu Item Schema
const menuItems = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    speciality: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    
}, { timestamps: true });

// Create and export the Menu Item Model
const MenuItem = mongoose.model('MenuItem', menuItems);

module.exports = MenuItem;