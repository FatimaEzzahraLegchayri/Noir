import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        const connect = await mongoose.connect(process.env.Mongo_db)
        console.log('connected to database..');
        
    } catch (error) {
        console.log('error connecting to databse', error);
        process.exit(1)
        
    }
}



