import mongoose from "mongoose";
import "dotenv/config"

mongoose.connect("mongodb://admin:password123@localhost:27017/myDatabase?authSource=admin");

export const UserShema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

export const user = mongoose.model("user", UserShema);

