



export interface IEmployee {
    name: string;
    gender: string;
    dob: string;
    address: string;
    mobile: string;
    email: string;
    department: string;
    designation: string;
    doj: string;
    profile: File | null;
}

export interface IEmployeePayload {
    _id:string
    name: string;
    gender: string;
    dob: string;
    address: string;
    mobile: string;
    email: string;
    department: string;
    designation: string;
    doj: string;
    profile: string;
}


export interface IDepartmentPayload {
    _id:string
    name: string;
    description: string;
}

export interface IDesignationPayload {
    _id:string
    name: string;
    description: string;
    department: string;
}