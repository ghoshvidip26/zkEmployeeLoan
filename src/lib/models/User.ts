import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const userSchema = new Schema({
    emailAddress: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
});

export default mongoose.models.User || mongoose.model("User", userSchema);