import { Request , Response , NextFunction } from "express";
import Employee from "../model/employee";
import Department from "../model/department";
import Designation from "../model/designation";
import CustomError from "../lib/util/CustomError";
import employeeSchema from "../lib/validation/employee";


const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return next(new CustomError(parsed.error.issues.map(i => i.message).join(", "), 400));

  const { name, gender, dob, address, mobile, email, department, designation, doj } = parsed.data;

  const exist = await Employee.findOne({ $or: [{ email }, { mobile }] });
  if (exist) {
    if (exist.email === email) return next(new CustomError("Email already exists", 400));
    if (exist.mobile === mobile) return next(new CustomError("Mobile already exists", 400));
  }

  const [departmentExist, designationExist] = await Promise.all([
    Department.findById(department),
    Designation.findById(designation)
  ]);

  if (!departmentExist) return next(new CustomError("Department not found", 400));
  if (!designationExist) return next(new CustomError("Designation not found", 400));

  if (!req.file) return next(new CustomError("Profile image is required", 400));

  const employee = new Employee({ ...parsed.data, profile: req.file.path });
  await employee.save();

  return res.status(201).json({ message: "Employee created successfully" });
};


const updateEmployee = async(req:Request, res:Response,next : NextFunction )=>{
    const {id} = req.params

    const employee = await Employee.findById(id)
    if(!employee) return next(new CustomError("Employee not found",404))

        const parsed = employeeSchema.partial().safeParse(req.body);
        if (!parsed.success) return next(new CustomError(parsed.error.issues.map(i => i.message).join(", "), 400));

        const {name , gender , dob , address , mobile , email , department , designation , doj} = parsed.data

        if(email || mobile){
            const exist = await Employee.findOne({$or:[{email},{mobile}],_id:{$ne:id}})
            if(exist){
                if(exist.email === email) return next(new CustomError("Email already exists",400))
                if(exist.mobile === mobile) return next(new CustomError("Mobile already exists",400))
            }
        }
        if(department){
            const departmentExist = await Department.findById(department)
            if(!departmentExist) return next(new CustomError("Department not found",400))
        }
        if(designation){
            const designationExist = await Designation.findById(designation)
            if(!designationExist) return next(new CustomError("Designation not found",400))
        }

        if(req.file){
            employee.profile = req.file.path
        }
        Object.assign(employee,parsed.data)
        await employee.save()
        return res.status(200).json({message:"Employee updated successfully"})
}


const deleteEmployee = async(req:Request, res:Response,next : NextFunction )=>{
    const {id} = req.params
    const employee = await Employee.findById(id)
    if(!employee) return next(new CustomError("Employee not found",404))
    await Employee.findByIdAndDelete(id)
    return res.status(200).json({message:"Employee deleted successfully"})
}

const getAllEmployees = async(req:Request, res:Response,next : NextFunction )=>{
    const employees = await Employee.find()
    if(employees.length === 0) res.status(200).json({message:"No employees found",employees:[]})
   
    return res.status(200).json({ message: "Employees found", employees });
}

const getEmployee = async(req:Request, res:Response,next : NextFunction )=>{
    const {id} = req.params
    const employee = await Employee.findById(id).populate({path:"department",select:"name"}).populate({path:"designation",select:"name"})

    if(!employee) return next(new CustomError("Employee not found",404))
        const formattedEmployee = {
            name: employee.name,
            gender: employee.gender,
            dob: employee.dob,
            address: employee.address,
            mobile: employee.mobile,
            email: employee.email,
            department: typeof employee.department === 'object' && employee.department !== null && 'name' in employee.department ? (employee.department as any).name : employee.department,
            designation: typeof employee.designation === 'object' && employee.designation !== null && 'name' in employee.designation ? (employee.designation as any).name : employee.designation,
            doj: employee.doj,
            profile: employee.profile
        }
    return res.status(200).json({message:"Employee found",employee:formattedEmployee})
}


export {createEmployee,updateEmployee,deleteEmployee,getAllEmployees , getEmployee}