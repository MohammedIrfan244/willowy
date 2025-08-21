import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongo";
import cors from "cors"
import { connectCloudinary } from "./config/cloudniray";
import  errorHandler  from "./middleware/errorHandler";
import  notFound  from "./middleware/notfound";
import departmentRouter from "./route/department";
import designationRouter from "./route/designation";
import employeeRouter from "./route/employee";




dotenv.config();
connectDB();
connectCloudinary();
const PORT = process.env.PORT || 3001


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))


app.get('/api/test',( req:Request , res:Response , next:NextFunction )=>{
    res.send("test")
})

app.use('/api/department',departmentRouter)
app.use('/api/designation',designationRouter)
app.use('/api/employee',employeeRouter)


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));