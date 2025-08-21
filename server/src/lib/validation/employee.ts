import {z} from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";


const employeeSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(20, "Name must be at most 20 characters long"),
    gender: z.string().min(3).max(20),
    dob: z.string().length(10),
    address: z.string().min(3).max(25),
    mobile: z.string().refine((value) => {
    try {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (phoneNumber) {
            return phoneNumber.isValid();
        }
        return false;
    } catch (err) {
        console.error("Validation error:", err);
        return false;
    }
}, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    department: z.string().min(3).max(25),
    designation: z.string().min(3).max(25),
    doj: z.string().min(3).max(25),
})

export default employeeSchema