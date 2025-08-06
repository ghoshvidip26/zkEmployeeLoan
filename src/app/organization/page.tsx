"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Trash2, DollarSign, Loader2 } from "lucide-react";
import axios from "axios";

interface Employee {
  _id?: string;
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,193,7,0.08),transparent_50%)]" />

        <div className="text-center animate-fadeIn">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-green-400 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-yellow-400/30 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-xl bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text font-semibold">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,193,7,0.08),transparent_50%)]" />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-10 left-20 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-70"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text">
              zkEmployeeLoan
            </span>{" "}
            <span className="text-white">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Manage your{" "}
            <span className="text-green-400 font-semibold">employee loans</span>{" "}
            with <span className="text-yellow-400 font-semibold">secure</span>{" "}
            blockchain integration and{" "}
            <span className="text-green-400 font-semibold">zero-knowledge</span>{" "}
            proof verification
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-green-500/10 to-yellow-500/5 backdrop-blur-sm p-8 rounded-3xl border border-green-500/30 hover:border-green-400/60 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slideUp">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-green-500/30 to-green-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="text-green-400 h-8 w-8 group-hover:animate-pulse" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">
                  Total Employees
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                  {employees.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-500/10 to-green-500/5 backdrop-blur-sm p-8 rounded-3xl border border-yellow-500/30 hover:border-yellow-400/60 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slideUp delay-150">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-yellow-500/30 to-yellow-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="text-yellow-400 h-8 w-8 group-hover:animate-pulse" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">
                  Total Payroll
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
                  $
                  {employees
                    .reduce((acc, curr) => acc + Number(curr.salary), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="group bg-gradient-to-br from-green-600/80 to-yellow-600/60 backdrop-blur-sm p-8 rounded-3xl border border-green-400/50 hover:border-yellow-400/70 shadow-2xl hover:shadow-green-500/40 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slideUp delay-300"
            onClick={() => setShowAddForm(true)}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black/30 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Plus className="text-white h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide mb-1">
                  Add New
                </p>
                <p className="text-3xl font-bold text-white">Employee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-green-500/10 to-yellow-500/5 backdrop-blur-sm p-8 rounded-3xl border border-green-500/30 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                  Add New Employee
                </h2>
                <p className="text-gray-300 mt-2">
                  Enter employee details for blockchain integration
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-3 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all duration-300 group"
              >
                <Plus className="h-6 w-6 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-300 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 hover:border-green-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="employee@company.com"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-yellow-500/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 hover:border-yellow-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-300 uppercase tracking-wide">
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
                  className="w-full p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 hover:border-green-500/50 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
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
                  className="w-full p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-yellow-500/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 hover:border-yellow-500/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-green-300 uppercase tracking-wide">
                  Position
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={newEmployee.position}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, position: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 hover:border-green-500/50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold rounded-2xl hover:from-green-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-8 py-4 bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm text-gray-300 rounded-2xl hover:text-white hover:from-gray-600/80 hover:to-gray-700/80 transition-all duration-300 font-semibold border border-gray-600/50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-gradient-to-br from-green-500/10 to-yellow-500/5 backdrop-blur-sm rounded-3xl border border-green-500/30 shadow-2xl overflow-hidden animate-slideUp delay-500">
          <div className="p-8 border-b border-green-500/20">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                  Employee Directory
                </h2>
                <p className="text-gray-300 mt-1">
                  Manage your team members and their blockchain identities
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-green-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-green-300 uppercase tracking-wider">
                    Blockchain
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
                    Compensation
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-green-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/20">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center animate-fadeIn">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400/20 to-yellow-400/20 rounded-3xl flex items-center justify-center mb-6">
                          <Users className="h-10 w-10 text-green-400" />
                        </div>
                        <p className="text-gray-300 text-xl font-semibold mb-2">
                          No employees added yet
                        </p>
                        <p className="text-gray-500 text-base">
                          Click &quot;Add Employee&quot; to build your
                          zkEmployeeLoan team
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gradient-to-r hover:from-green-500/10 hover:to-yellow-500/5 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-400 to-yellow-400 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-black font-bold text-lg">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors duration-300">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-400 font-mono">
                              ID: {employee.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-base text-gray-300 group-hover:text-yellow-300 transition-colors duration-300">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-300 font-mono bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-500/20 group-hover:border-green-400/40 transition-all duration-300">
                          <span className="text-green-400">
                            {employee.walletAddress}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                          ${employee.salary.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30">
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleDeleteEmployee(employee._id || employee.id)
                          }
                          className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-2xl transition-all duration-300 group/btn"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
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
