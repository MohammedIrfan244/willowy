import axios from "axios";
import axiosError from "./util/axiosError";
import { IEmployee , IDepartmentPayload ,IDesignationPayload , IEmployeePayload } from "./util/type";



export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });


//employee

export const createEmployee = async (employee: IEmployee) => {
  try {
    const formData = new FormData();

    Object.entries(employee).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const res = await api.post(process.env.NEXT_PUBLIC_API_URL+"/employee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(res.data.message);
    return res.data;
  } catch (err) {
    throw new Error(axiosError(err));
  }
};


export const updateEmployee = async (id: string, employee: IEmployee) => {
  try {
    const formData = new FormData();

    Object.entries(employee).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    const res = await api.patch(process.env.NEXT_PUBLIC_API_URL+"/employee/"+id, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(res.data.message);
    return res.data;
  } catch (err) {
    throw new Error(axiosError(err));
  }
};


export const deleteEmployee = async (id: string) => {
  try {
    const res = await api.delete(process.env.NEXT_PUBLIC_API_URL+"/employee/"+id);
    alert(res.data.message);
    return res.data;
  } catch (err) {
    throw new Error(axiosError(err));
  }
};

export const getAllEmployees = async () => {
  try {
    const res = await api.get(process.env.NEXT_PUBLIC_API_URL+"/employee");
    console.log(res.data.employees)
    return res.data.employees as IEmployeePayload[];
  } catch (err) {
    throw new Error(axiosError(err));
  }
}

export const getEmployee = async (id: string) => {
  try {
    const res = await api.get(process.env.NEXT_PUBLIC_API_URL+"/employee/"+id);
    return res.data.employee as IEmployeePayload;
  } catch (err) {
    throw new Error(axiosError(err));
  }
};


// department

export const getAllDepartments = async () => {
  try {
    const res = await api.get(process.env.NEXT_PUBLIC_API_URL+"/department");
    return res.data.departments as IDepartmentPayload[];
  } catch (err) {
    throw new Error(axiosError(err));
  }
}



// designation

export const getDesignations = async (id: string) => {
  try {
    const res = await api.get(process.env.NEXT_PUBLIC_API_URL+"/designation/"+id);
    return res.data.designations as IDesignationPayload[];
  } catch (err) {
    throw new Error(axiosError(err));
  }
}