import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/models/mongodb";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { id, email } = await request.json();
    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and email are required" },
        { status: 400 }
      );
    }
    const newUser = new User({
      id: id,
      email: email,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error");
    return NextResponse.json(
      { error: "Failed to process user request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const employee = await User.find({});
    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}
