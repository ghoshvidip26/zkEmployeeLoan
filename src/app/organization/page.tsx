"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Trash2, DollarSign, Loader2 } from "lucide-react";
import axios from "axios";

interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  salary: number;
  position: string;
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    walletAddress: "",
    salary: 0,
    position: "",
  });
  console.log("Wallet Address:", newEmployee.walletAddress);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee");
        setEmployees(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching employees", err);
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const res = await axios.post("/api/employee", newEmployee);
      setEmployees([...employees, res.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding employee", err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await axios.delete(`/api/employee/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  const handleModifyEmployee = async (id: string) => {
    try {
      await axios.put(`/api/employee/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (err) {
      console.error("Error modifying employee", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Employee Management Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your zkVerify workforce with secure blockchain integration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-green-500/20 rounded-xl">
                <Users className="text-green-400 h-8 w-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Total Employees
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employees.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-green-500/20 rounded-xl">
                <DollarSign className="text-green-400 h-8 w-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Total Salary
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  $
                  {employees
                    .reduce((acc, curr) => acc + Number(curr.salary), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl border border-green-500/30 shadow-2xl cursor-pointer hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setShowAddForm(true)}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black/20 rounded-xl">
                <Plus className="text-white h-8 w-8" />
              </div>
              <div>
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                  Add New
                </p>
                <p className="text-2xl font-bold text-white mt-1">Employee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Add New Employee
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="employee@company.com"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={newEmployee.walletAddress}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      walletAddress: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Annual Salary
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={newEmployee.salary}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      salary: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">
                  Position
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={newEmployee.position}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, position: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-green-500/25"
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-4 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Employee Directory
            </h2>
            <p className="text-gray-400 mt-1">
              Manage your team members and their details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400 text-lg">
                          No employees added yet
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Click &quot;Add Employee&quot; to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-4">
                            <span className="text-white font-semibold text-sm">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {/* ID: {employee.id.slice(0, 8)}... */}
                              ID: {employee.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 font-mono bg-gray-700/50 px-3 py-1 rounded-lg">
                          {/* {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)} */}
                          <span>{employee.walletAddress}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-400">
                          ${employee.salary.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteEmployee(employee._id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
