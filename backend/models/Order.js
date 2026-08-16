const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.type.ObjectId, ref: 'User', required: true},
    products: [
        {
            product: { type: mongoose.Schema.type.ObjectId, ref: 'Product', required: true},
            quantity: { type: Number, required: true},
        }

    ],
    totalAmount: { type: Number, required: true},

    
} , 
paymentId: { type: String, required: true},
status: { type: String, required: true, default: 'pending' }
}, {
    timestamps: true},
});
module.exports = mongoose.model('Order', orderSchema);