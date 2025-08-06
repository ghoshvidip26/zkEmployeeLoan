import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/models/mongodb";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    console.log("Connecting to DB...");
    await dbConnect();
    console.log("Connected.");

    const { id, email } = await request.json();
    console.log("Received data: ", { id, email });

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and email are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists.");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    const newUser = new User({ id, emailAddress: email });
    console.log("Creating new user: ", newUser);
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error processing user request:", err);
    return NextResponse.json(
      { error: "Failed to process user request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}
