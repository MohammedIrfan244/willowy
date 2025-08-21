import { Request , Response , NextFunction } from "express";


interface CustomError extends Error{
    statusCode?:number
}

const errorHandler = async (err:CustomError, req:Request,res:Response,next:NextFunction)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || "Internal server error"
    const route = req.originalUrl || ""
    console.log(`Error: ${message} - Route: ${route}`)
    res.status(statusCode).json({message:message})
}

export default errorHandler