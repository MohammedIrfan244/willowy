import mongoose, { Schema, Document } from "mongoose";


export interface IEmployee extends Document {
    name: string;
    gender:string
    dob:string
    address:string
    mobile:string
    email:string
    department: mongoose.Types.ObjectId
    designation: mongoose.Types.ObjectId
    doj:string
    profile:string
}

const employeeSchema = new Schema<IEmployee>({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true , unique: true },
    email: { type: String, required: true , unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true },
    doj: { type: String, required: true },
    profile: { type: String, required: true },
  });
  
  const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
  
  export default Employee