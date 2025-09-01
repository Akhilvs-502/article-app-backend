import express from 'express'
import dotenv from 'dotenv'
import { env } from './config/env'
import cors from 'cors'
import { connectDB } from '@/infrastructure/database/connections/MongoConnection'
import userRouter from '@/interface/routes/userRouter'   
import { ErrorHandler } from './middelware/errorHandler'

const app=express()
dotenv.config()


app.use(express.json())
app.use(cors({origin:env.FRONTEND_URL,credentials:true}))
app.use("/api/user",userRouter)
app.use(ErrorHandler)


connectDB()

app.listen(env.PORT,()=>{

    console.log("server started.....")


})
