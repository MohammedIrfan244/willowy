"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getAllDepartments,
  getDesignations,
  getEmployee,
} from "@/lib/api";
import {
  IEmployee,
  IEmployeePayload,
} from '@/lib/util/type';
import Image from 'next/image';

const initialEmployeeState: IEmployee = {
  name: '',
  gender: '',
  dob: '',
  address: '',
  mobile: '',
  email: '',
  department: '',
  designation: '',
  doj: '',
  profile: new File([], ''),
};

const Employee = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<IEmployee>(initialEmployeeState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  });

  const { data: departments, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
  });

  const { data: designations } = useQuery({
    queryKey: ['designations', selectedDepartmentId],
    queryFn: () => getDesignations(selectedDepartmentId),
    enabled: !!selectedDepartmentId,
  });

  const { data: employeeData } = useQuery({
    queryKey: ['employee', editingId],
    queryFn: () => getEmployee(editingId as string),
    enabled: !!editingId,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setFormData(initialEmployeeState);
      setSelectedDepartmentId('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; employee: IEmployee }) =>
      updateEmployee(data.id, data.employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditingId(null);
      setFormData(initialEmployeeState);
      setSelectedDepartmentId('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  useEffect(() => {
    if (employeeData) {
      setFormData({
        ...employeeData,
        profile: new File([], ''),
      });
      setSelectedDepartmentId(employeeData.department);
    }
  }, [employeeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    setFormData((prev) => ({ ...prev, department: departmentId, designation: '' }));
    setSelectedDepartmentId(departmentId);
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, mobile: `+${value}` }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (editingId) {
      updateMutation.mutate({ id: editingId, employee: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (employee: IEmployeePayload) => {
    setEditingId(employee._id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialEmployeeState);
    setSelectedDepartmentId('');
  };

  if (employeesLoading) return <div>Loading employees...</div>;
  if (departmentsLoading) return <div>Loading departments...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Employee Management</h1>
              {/* form area here */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">{editingId ? 'Update Employee' : 'Add Employee'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={formData.dob}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            <PhoneInput
              country={'us'}
              value={formData.mobile.replace('+', '')}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'mobile',
                required: true,
              }}
              inputStyle={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #93c5fd', // blue-300
                borderRadius: '0.25rem',
                outline: 'none',
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Department</option>
              {departments?.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              disabled={!selectedDepartmentId}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-200"
            >
              <option value="">Select Designation</option>
              {designations?.map((desig) => (
                <option key={desig._id} value={desig._id}>
                  {desig.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="doj"
              placeholder="Date of Joining (YYYY-MM-DD)"
              value={formData.doj}
              onChange={handleInputChange}
              required
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />

            <input
              type="file"
              name="profile"
              onChange={handleFileChange}
              required={!editingId}
              className="p-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500 col-span-1 md:col-span-2"
            />

            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* lsiting */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Employee List</h2>
          {employees?.length === 0 ? (
            <div className="text-center text-gray-500">No employees found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-blue-300 rounded-lg">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Profile</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Department</th>
                    <th className="py-3 px-6 text-left">Designation</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees?.map((employee) => (
                    <tr key={employee._id} className="border-b border-blue-200 hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-6">
                        <Image src={employee.profile} alt="Profile" width={100} height={100} className="rounded-full" />
                      </td>
                      <td className="py-4 px-6">{employee.name}</td>
                      <td className="py-4 px-6">{employee.department}</td>
                      <td className="py-4 px-6">{employee.designation}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="bg-blue-300 text-blue-800 font-semibold py-1 px-3 rounded mr-2 hover:bg-blue-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;