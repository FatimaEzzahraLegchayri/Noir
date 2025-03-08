import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true, 'product name is required']
    },
    description:{
        type:String,
        require:[true, 'product description is required']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        require:true
    },
    isFeatured:{
        type:String,
        default:false
    },
    price:{
        type:Number,
        require:[true, `Enter a valid price`],
        min:0
    },
    image:{
        type:String,
        require:[true, 'Image is required']
    },

},{timestamps: true})

export const Product = mongoose.model('Product', productSchema)
    

