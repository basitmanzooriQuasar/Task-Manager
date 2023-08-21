const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A task must have a name"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    // required: [true, "A task must have a description"],
  },
  completed: {
    type: Boolean,
    default: false,
    // required: [true, "A task must have a status"],
  },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
