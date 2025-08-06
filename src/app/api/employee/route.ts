import dbConnect from "@/lib/models/mongodb";
import Employees from "@/lib/models/Employees";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { name, email, walletAddress, salary, position } =
      await request.json();
    console.log("Received data:", {
      name,
      email,
      walletAddress,
      salary,
      position,
    });
    await dbConnect();
    const existingUser = await Employees.findOne({ name });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Employee already exists" }),
        {
          status: 409,
        }
      );
    }
    const newEmployee = new Employees({
      id: uuidv4(),
      name: name,
      email: email,
      walletAddress: walletAddress,
      salary: salary,
      position: position,
    });
    console.log("New employee data:", newEmployee);

    await newEmployee.save();

    return new Response(
      JSON.stringify({ message: "Employee registered successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error in POST /employee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to register employee" }),
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const employee = await Employees.find({});
    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch employee" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    await dbConnect();
    const { name } = params;
    await Employees.deleteOne({ name });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete employee" }),
      {
        status: 500,
      }
    );
  }
}
