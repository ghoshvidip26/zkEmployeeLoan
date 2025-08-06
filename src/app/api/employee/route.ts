import dbConnect from "@/lib/models/mongodb";
import Employees from "@/lib/models/Employees";
import { v4 as uuidv4 } from "uuid";
// Parameters to be taken: Name, Employee Email, Address, Salary, Position
export async function POST(request: Request) {
  try {
    const { name, email, address, salary, position } = await request.json();
    await dbConnect();
    const existingEvent = await Employees.findOne({ name });
    if (existingEvent) {
      return new Response(JSON.stringify({ message: "Employee already exists" }), {
        status: 409,
      });
    }
    const newEmployee = new Employees({
      id: uuidv4(),
        name: name,
        email: email,
        address: address,
        salary: salary,
        position: position,
    });

    await newEmployee.save();

    return new Response(JSON.stringify({ message: "Employee registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.log("Error in POST /employee:", error);
  }
}

export async function GET(){
  try {
    await dbConnect();
    const employee = await Employees.find({});
    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch employee" }), { status: 500 });
  }
}