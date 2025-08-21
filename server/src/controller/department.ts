import { Request, Response , NextFunction } from "express";
import Department from "../model/department";
import CustomError from "../lib/util/CustomError";
import Designation from "../model/designation";


const createDepartment = async ( req:Request , res:Response , next:NextFunction )=>{
    const {name,description}=req.body
    if(!name || !description) return next(new CustomError("All fields are required",400))
        const exist = await Department.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if(exist) return next(new CustomError("Department already exist",400))
            const newName = name.trim()
            const newDescription = description.trim()
    const department = await Department.create({name:newName,description:newDescription})
if(!department) return next(new CustomError("Error creating department",500))
res.status(201).json({message:"Department created successfully"})
}

const deleteDepartment = async ( req:Request , res:Response , next:NextFunction )=>{
    const {id} = req.params
    if(!id) return next(new CustomError("All fields are required",400))
    const department = await Department.findById(id)
    if(!department) return next(new CustomError("Department not found",404))
    Promise.all([
        Designation.deleteMany({department:department._id}),
        Department.deleteOne({_id:department._id})
    ])
    res.status(200).json({message:"Department deleted successfully"})
}

const getDepartments = async ( req:Request , res:Response , next:NextFunction )=>{
    const departments = await Department.find()
    if(departments.length===0) return res.status(200).json({message:"No departments found",departments:[]})
    res.status(200).json({message:"Departments fetched successfully",departments})

}

export {createDepartment,deleteDepartment,getDepartments}