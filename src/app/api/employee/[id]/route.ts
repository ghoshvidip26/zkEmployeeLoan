import { NextRequest } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Employees from "@/models/Employee";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const employeeId = params.id;
    console.log("Deleting employee with ID:", employeeId);

    if (!Types.ObjectId.isValid(employeeId)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    await Employees.findByIdAndDelete(employeeId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to delete employee", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const employeeId = params.id;
    console.log("Updating employee with ID:", employeeId);

    if (!Types.ObjectId.isValid(employeeId)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    await Employees.findByIdAndUpdate(employeeId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Failed to update employee", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
