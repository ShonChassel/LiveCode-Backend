import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
  },
  
});

export default mongoose.model("Task", TaskSchema)