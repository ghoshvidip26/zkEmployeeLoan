import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const employeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true },
    salary: { type: Number, required: true },
    position: { type: String, required: true },
});

export default mongoose.models.Employee || mongoose.model("Employee", employeeSchema);