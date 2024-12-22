const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    phone: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        default: '' // Optional field, so setting default as empty string
    },
    feedback: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5 // Assuming ratings are between 1 and 5
    },
    feedback_time: {
        type: Date,
        default: Date.now // Automatically set the current date and time
    },
    menu_items: [{
        type: String,//will be null if ratings are for cafe
        trim: true
    }]
    // Add any additional fields you need here
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
