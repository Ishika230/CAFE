const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    shortName: {
        type: String,
        required: true,
        index:true,//indexing added for faster searches
        unique: true,
        trim: true
    },
    speciality: {
        type: String,
        required: true,
        trim: true
    },
    sizes: [{
        size: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    price: {
        type: Number,
        required: function() {
            return !this.sizes || this.sizes.length === 0; //REMEMBER: HERE, IF SIZES ARE NOT APPLICABLE, ONLY THEN PRICE COLUMN WILL SHOW
                                                            //PRICE
        },
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: false
    },
    category: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
