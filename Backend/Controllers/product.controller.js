import cloudinary from "../Config/Cloudinary"
import { Product } from "../Models/product.model.js"

export const getAllProducts = async (req,res) =>{
    try {
        const products = await Product.find()
        if(products.length <= 0){
            return res.status(400).json({success: false, messag: 'No product found'})
        }
        return res.status(200).json(products)
    } catch (error) {
        console.log('error fetching products in the controller');
        return res.status(500).json({success: false, error: error.message, message:'server error '})
    }
}

export const createProduct = async(req,res) =>{
    try {
        const {name, description, price,category, image} = req.body
        let  cloudinaryResponse;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:'Products'})
        }
        
        const product = await Product.create({
            name, 
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : ''
        })
        return res.status(201).json(product)
    } catch (error) {
        console.log('error creating product in the controller', error.message);
        return res.status(500).json({success: false, error: error.message, message:'server error '})
    }
}

export const getFeaturedProducts = async(req, res) =>{
    try {
        const featuredProducts = await Product.find({isFeatured: true})
        if(featuredProducts.length <= 0){
            return res.status(400).json({success: false, messag: 'No featured product found'})
        }
        return res.status(200).json( featuredProducts)
    } catch (error) {
        console.log('error fetching products in the controller', error.message);
        return res.status(500).json({success: false, error: error.message, message:'server error '})
    }
}

export const updateProduct = async(req,res) =>{
    const {id} = req.params.id
    const updatedData = req.body
    try {
        const product = await Product.findByIdAndUpdate(id, updatedData)
        if(!product) return res.status(400).json('no product found')
            return res.status(200).json(product)
        
    } catch (error) {
        console.log('error updating products', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const deleteProduct = async(req,res) =>{
    try {
        const {id} = req.params.id
        const product = await Product.findById(id)
        if(!product){
            return res.status(400).json({message: 'no product found'})
        }

        if(product.image){
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`product/${publicId}`)
                console.log('image deleted from cloudinary');
            } catch (error) {
                console.log('error deleting image from cloudinary', error);
            }
        }
        
        await product.deleteOne(id)
        return res.status(200).json({message:'product deleted successfuly'})

    } catch (error) {
        console.log('error deleting image from cloudinary', error);
        return res.status(500).json({message:'Server error ', error: error.message})
    }
}

export const getRecommendedProducts = async(req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])
        return res.status(200).json(products)
    } catch (error) {
        console.log('error getting recommendations products', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const getProductsByCategory = async(req,res) => {
    try {
        const {category} = req.params.category
        const products = await Product.find({category})
        return res.status(200).json(products)
    } catch (error) {
        console.log('error getting products by category', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const toggelFeaturedProducts = async(req, res) =>{
    try {
        const {id} = req.params.id
        const product = await product.findById(id)
        if(!product){
            return res.status(400).json({message:'no product found'})
        }
        product.isFeatured = !product.isFeatured
        const updatedProduct = await product.save()
        return res.status(200).json(updatedProduct)
    } catch (error) {
        console.log('error toggling product', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}