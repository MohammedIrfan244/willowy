import { Request , Response , NextFunction } from "express";
import Designation from "../model/designation";
import CustomError from "../lib/util/CustomError";
import Department from "../model/department";



const createDesignation = async ( req:Request , res:Response , next:NextFunction )=>{
    const { name , description , department } = req.body
    if(!name || !description || !department) return next(new CustomError("All fields are required",400))
        const exist = await Designation.findOne({ name, department });
if(exist) return next(new CustomError("Designation already exists in this department", 400));

        const designation = await Designation.create({name , description , department})
    if(!designation) return next(new CustomError("Designation not created",400))
        res.status(201).json({message:"Designation created successfully"})
}

const deleteDesignation = async ( req:Request , res:Response , next:NextFunction )=>{
    const { id } = req.params
    if(!id) return next(new CustomError("Designation id is required",400))
    const designation = await Designation.findByIdAndDelete(id)
    if(!designation) return next(new CustomError("Designation not found",400))
    res.status(200).json({message:"Designation deleted successfully"})
}

const getDesignations = async ( req:Request , res:Response , next:NextFunction )=>{
    const { departmentId } = req.params
    const departmentExist = await Department.findById(departmentId)
    if(!departmentExist) return next(new CustomError("Department not found",400))
    const designations = await Designation.find({department:departmentId})
    if(designations.length === 0) return res.status(200).json({message:"No designations found",designations:[]})
    res.status(200).json({message:"Designations found successfully",designations})
}

export {createDesignation , deleteDesignation , getDesignations}