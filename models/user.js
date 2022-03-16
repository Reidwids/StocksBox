// Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Your password should be atleast 6 characters"]
    },
    preferredCurrency: {
        type: String,
        required: true,
        enum: ['CAD','USD'],
    },
    image:{
        type: String,
    },
    bio: {
        type: String,
        maxlength: [200, "Less talky-talky more stocky-stocky"]
    },
    userGainsHist: [{
        type: Number,
    }],
    userGainsHistTimestamps: [{
        type: Date,
    }],
    // posts:[{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Posts'
        // }]
    // }
    portfolios:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Portfolios'
        }],
    followers:{
        type: Array,
        default: [],
    },
    followings:{
        type: Array,
        default: [],
    }
    //admin boolean false
    //friends:[{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Friends'
        // }]

}
,
    {
        timestamps: true
    })


    // verifyPassword
    userSchema.methods.verifyPassword = function(password){
        console.log(password);
        console.log(this.password);
        return bcrypt.compareSync(password, this.password);
    }

const User = mongoose.model("User", userSchema);

module.exports = User;