import express from 'express'
import dotenv from 'dotenv'
import { env } from './config/env'
import cors from 'cors'
import { connectDB } from '@/infrastructure/database/connections/MongoConnection'
import userRouter from '@/interface/routes/userRouter'   
import { ErrorHandler } from './middleware/errorHandler'
import cookieParser from 'cookie-parser'

const app=express()
dotenv.config()

app.use(cookieParser())
app.use(express.json())
app.use(cors({origin:env.FRONTEND_URL,credentials:true}))
app.use("/api/user",userRouter)
app.use(ErrorHandler)


connectDB()

app.listen(env.PORT,()=>{

    console.log("server started.....")


})
