const order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

//create a new order 
const createOrder = async (req,res)=>{
    try{
         const {products , totalAmount , address, paymentId } = req.body ;
         if(!products || products.length === 0 || !totalAmount || !address || !paymentId){
            return res.status(400).json({message: 'Please provide all required fields'});
         } 
         else{
            const newOrder = new order({
                user: req.user._id,
                products,   
                totalAmount,
                address,

                paymentId,
                status: 'pending'
            }); 
            await newOrder.save();
            await sendEmail(req.user.email ,'order creaed' , 'your order intiated');
            res.status(201).json({message: 'Order created successfully', order: newOrder});

         }
         catch(error){
            res.status(500).json({message: 'Server error', error: error.message});      
     
    }
};
const myOrders = async(req,res)=>{
    try{
        const orders = await order.find({user: req.user._id}).populate('products.product', 'name price');
        res.status(200).json({orders});
    }catch(error);
    ){
        res.status(500).json({message: 'Server error', error: error.message});
    }

}
const getOrders = async(req,res)=>{
    try{
        const  orders = await Order.find({}).populate('user'  , 'name email')
        res.json(orders);
    }catch(error){
        res.status(500).json({meassage : "error occured", error}) ;
    }
} 
const updateOrdersStatus = async (req,res) => {
    try{
        const {status} = req.body ;
        const order = await Order.findById(req.param.id);
        if(order){
            order.status = status;
            await order.save();
            res.json({message: 'order status updated' , order});

        }
        else{
            res.status(404).json({message: 'order not found '});
        }
    }catch(error){
        res.status(500).json({message:'order not found'});
    }
}

module.exports = {
    createOrder,
    myOrders,
    getOrders
};

