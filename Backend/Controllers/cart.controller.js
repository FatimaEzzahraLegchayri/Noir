export const addToCart = async(req,res) =>{
    try {
        const {productId} = req.body
        const user = req.user
        const existingItems = user.cartItems.find(item => item.id === productId )
        if(existingItems){
            existingItems.quantity += 1
        }else{
            user.cartItems.push(productId)
        }
        
        await user.save()
        return res.status(200).json(user.cartItems)
    } catch (error) {
        console.log('error in addToCart controller', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const removeAllCartProducts = async(req,res) =>{
    try {
        const {productId} = req.body
        const user = req.user
        if(!productId){
            // user.cartItems = []
            return res.status(400).json({ message: 'Product ID is required to remove an item from the cart.' });
        }else{
            user.cartItems = await user.cartItems.filter(item => item.id !== productId) //item.product.toString()
        }
        
        await user.save()
        res.status(200).json(user.cartItems)

    } catch (error) {
        console.log('error in removeAllCartProducts controller', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const updateQuantity = async(req,res) =>{
    try {
        const {productId} = req.params
        const {quantity} = req.body
        const user = req.user

        const existingItems = user.cartItems.find(item => item.product.toString() === productId)
        if(existingItems){
          if(quantity ===0 ){
            user.cartItems = user.cartItems.filter(item => item.product !== productId)
            await user.save()
            return res.json(user.cartItems)
          }

          existingItems.quantity = quantity
          await user.save()
          return res.json(user.cartItems)

        }else{
          return res.status(400).json({message:'item not found'})
        }
    } catch (error) {
        console.log('error in updateQuantity controller', error);
        return res.status(500).json({message: 'server error ', error: error.message})
    }
}

export const getCartProducts = async(req,res) =>{
    try {
        const user = req.user
        await user.populate("cartItems.product");  //2:14

        return res.status(200).json(user.cartItems); 
    } catch (error) {
        
    }
}
 