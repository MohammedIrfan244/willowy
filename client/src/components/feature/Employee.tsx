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
import { 
  FiUsers, 
  FiUserPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiBriefcase,
  FiUpload,
  FiLoader,
  FiUserCheck
} from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import isAdult from '@/lib/util/isAdult';

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

  if (employeesLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 text-lg text-gray-600">
        <FiLoader className="animate-spin" />
        Loading employees...
      </div>
    </div>
  );
  if (departmentsLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 text-lg text-gray-600">
        <FiLoader className="animate-spin" />
        Loading departments...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">Employee Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your team efficiently</p>
        </div>
        
        {/* form area here */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              {editingId ? <FiEdit3 className="h-5 w-5 text-blue-600" /> : <FiUserPlus className="h-5 w-5 text-blue-600" />}
            </div>
            <h2 className="text-xl font-medium text-gray-900">{editingId ? 'Update Employee' : 'Add New Employee'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-gray-700 text-xs sm:text-sm font-medium">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="gender" className="block text-gray-700 text-xs sm:text-sm font-medium">Gender</label>
              <div className="relative">
                <FiUserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="gender"
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="dob" className="block text-gray-700 text-xs sm:text-sm font-medium">Date of Birth</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  min={isAdult()}
                  placeholder="Date of Birth"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="address" className="block text-gray-700 text-xs sm:text-sm font-medium">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile" className="block text-gray-700 text-xs sm:text-sm font-medium">Mobile Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <PhoneInput
                  country={'us'}
                  value={formData.mobile.replace('+', '')}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: 'mobile',
                    required: true,
                    id: 'mobile',
                  }}
                  inputStyle={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingLeft: '44px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                  }}
                  buttonStyle={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px 0 0 8px',
                    backgroundColor: '#f9fafb',
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-gray-700 text-xs sm:text-sm font-medium">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="department" className="block text-gray-700 text-xs sm:text-sm font-medium">Department</label>
              <div className="relative">
                <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments?.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="designation" className="block text-gray-700 text-xs sm:text-sm font-medium">Designation</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  disabled={!selectedDepartmentId}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
                >
                  <option value="">Select Designation</option>
                  {designations?.map((desig) => (
                    <option key={desig._id} value={desig._id}>
                      {desig.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="doj" className="block text-gray-700 text-xs sm:text-sm font-medium">Date of Joining</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="doj"
                  type="date"
                  name="doj"
                  placeholder="Date of Joining"
                  value={formData.doj}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="profile" className="block text-gray-700 text-xs sm:text-sm font-medium">Profile Picture</label>
              <div className="relative">
                <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="profile"
                  type="file"
                  name="profile"
                  onChange={handleFileChange}
                  required={!editingId}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
              disabled={createMutation.isPending || updateMutation.isPending}
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                {
                  createMutation.isPending || updateMutation.isPending?(
                    <>
                    <FiLoader className="h-4 animate-spin w-4" />
                {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ):(
                    <>
                    <FiSave className="h-4 w-4" />
                {editingId ? 'Update Employee' : 'Add Employee'}
                    </>
                  )
                }
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* lsiting empl here */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiUsers className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Employee Directory</h2>
                <p className="mt-1 text-sm text-gray-600">{employees?.length || 0} employees total</p>
              </div>
            </div>
          </div>
          
          {employees?.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FiUsers className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div className="text-gray-400 text-lg">No employees found</div>
              <p className="text-gray-500 text-sm mt-2">Add your first employee to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees?.map((employee, index) => (
                    <tr key={employee._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-8 py-6">
                        <Image 
                          src={employee.profile} 
                          alt="Profile" 
                          width={48} 
                          height={48} 
                          className="rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ring-2 ring-gray-200" 
                        />
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-900">{employee.name}</td>
                      <td className="px-8 py-6 text-sm text-gray-600">{employee.department}</td>
                      <td className="px-8 py-6 text-sm text-gray-600">{employee.designation}</td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <FiEdit3 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <FiTrash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
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