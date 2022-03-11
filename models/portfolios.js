// Dependencies
const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    assets:[{
        typeOfAsset: {
            type: String,
            required: true,
            enum: ['stocks', 'crypto']
        },
        name: {
            type: String,
            required: true,
        },
        priceObtained: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    isPublic: {
        type: Boolean,
        required: true,
    }
},
    {
        timestamps: true
    }
)

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;