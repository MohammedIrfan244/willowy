import { Request, Response , NextFunction } from "express";
import CustomError from "../lib/util/CustomError";


const notFound = async ( req:Request , res:Response , next:NextFunction )=>{
    const error = new Error(`Not Found the route - ${req.originalUrl}`)
    return next(new CustomError(error.message,404))
}

export default notFound