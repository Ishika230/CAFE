const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        default: '' // Optional field, so setting default as empty string
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming ratings are between 1 and 5
    },
    feedback_time: {
        type: Date,
        default: Date.now // Automatically set the current date and time
    },
    // Add any additional fields you need here
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
