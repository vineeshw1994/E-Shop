const mongoose = require('mongoose');
const productModel = require('../models/productmodel')


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
    },
    email : {
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isblocked : {
        type : Boolean,
        required : true,
        default : false
    },cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: productModel
            },
            quantity: {
                type: Number,
                default: 1
            },
            realPrice: {
                type: Number,
            },
            price: {
                type: Number,
                require: true
            }
        }]
    },
    
    
    
    wishlist: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: productModel
        }
    }],
    address: [{
        name: {
            type: String,
            required: true
        },
        houseName: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        postalCode: {
            type: Number,
            required: true
        }
    }]
})


const usercollection = new mongoose.model("userdata",userSchema);

module.exports = usercollection;
