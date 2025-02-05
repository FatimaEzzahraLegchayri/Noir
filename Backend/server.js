import express from 'express'
import dotenv from 'dotenv'

import {connectDb} from './Db/Connect.Db.js'
import authRoutes from './Routes/Auth.route.js'

dotenv.config()
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000;

// app.get('/', (req,res)=>{
//     res.send('hello  ')
// })

app.use('/auth', authRoutes)

app.listen(PORT,  ()=>{
    connectDb()
    console.log('listening on port :', PORT);
    
})



