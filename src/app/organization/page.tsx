"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Trash2, DollarSign, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
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
  const [showAddForm, setShowAddForm] = useState(false); // ✅ Moved here
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    walletAddress: "",
    salary: 0,
    position: "",
  });

  const { user } = usePrivy();

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
      setNewEmployee({
        name: "",
        email: "",
        walletAddress: "",
        salary: 0,
        position: "",
      });
    } catch (err) {
      console.error("Error adding employee", err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await axios.delete(`/api/employee/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
          <div className="flex items-center gap-x-4">
            <Users className="text-white" />
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-xl font-semibold">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
          <div className="flex items-center gap-x-4">
            <DollarSign className="text-white" />
            <div>
              <p className="text-sm text-muted-foreground">Total Salary</p>
              <p className="text-xl font-semibold">
                $
                {employees
                  .reduce((acc, curr) => acc + Number(curr.salary), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div
          className="bg-green-500 text-black p-6 rounded-xl border border-neutral-700 cursor-pointer hover:bg-green-400 transition"
          onClick={() => setShowAddForm(true)}
        >
          <div className="flex items-center gap-x-4">
            <Plus />
            <div>
              <p className="text-xl font-semibold">Add Employee</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Added form section below summary cards */}
      {showAddForm && (
        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 mb-8 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
            className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 text-white"
          />
          <input
            type="text"
            placeholder="Wallet Address"
            value={newEmployee.walletAddress}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, walletAddress: e.target.value })
            }
            className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 text-white"
          />
          <input
            type="number"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={(e) =>
              setNewEmployee({
                ...newEmployee,
                salary: parseInt(e.target.value) || 0,
              })
            }
            className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 text-white"
          />
          <input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, position: e.target.value })
            }
            className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 text-white"
          />
          <button
            onClick={handleAddEmployee}
            className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition-all"
          >
            Add Employee
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white">
          <thead className="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Wallet</th>
              <th className="px-6 py-3">Salary</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-neutral-700 hover:bg-neutral-800 transition"
              >
                <td className="px-6 py-4">{employee.name}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">{employee.walletAddress}</td>
                <td className="px-6 py-4">
                  ${employee.salary.toLocaleString()}
                </td>
                <td className="px-6 py-4">{employee.position}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
