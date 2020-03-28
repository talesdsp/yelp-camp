import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: false },
  password: String,
});

const User = mongoose.model("User", UserSchema);
export default User;
