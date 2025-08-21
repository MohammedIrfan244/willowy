import mongoose , { Schema , Document} from "mongoose";


export interface IDesignation extends Document {
        name: string;
        description: string;
        department: mongoose.Types.ObjectId;
    }


    const designationSchema = new Schema<IDesignation>({
        name: { type: String, required: true , unique: true },
        description: { type: String, required: true },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
      });
      
      const Designation = mongoose.model<IDesignation>('Designation', designationSchema);
      
      export default Designation
    