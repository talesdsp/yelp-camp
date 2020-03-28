import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
