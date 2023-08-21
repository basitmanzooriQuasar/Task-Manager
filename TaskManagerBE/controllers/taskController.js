const Task = require("../model/taskModel");
const AppError = require("../utils/appError");
const User = require("../model/userModel");
//catching errors in async functions
const catchAsync = require("../utils/catchAsync");

//GET ALL TASKS
const getAllTasks = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  res.status(200).json({
    status: "success",
    message: "Tasks fetched successfully",
    data: {
      tasks: user.tasks,
      user: user,
    },
  });
});

//GET TASK BY ID
const getTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const task = await user.tasks.id(req.params.id);
  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Task fetched successfully",
    data: {
      task,
    },
  });
});

//CREATE TASK
const createTask = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    //push the task
    $push: {
      tasks: {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed,
      },
    },
  });
  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: user.tasks,
  });
});

//UPDATE TASK BY ID
const updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await User.findOneAndUpdate(
    { _id: req.user.id, "tasks._id": req.params.id },
    {
      $set: {
        "tasks.$.name": req.body.name,
        "tasks.$.description": req.body.description,
        "tasks.$.completed": req.body.completed,
      },
    },
    { new: true }
  );

  if (!updatedTask) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    task: {
      task: updatedTask,
    },
  });
});

//DELETE TASK BY ID
const deleteTask = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { tasks: { _id: req.params.id } } },
    { new: true }
  );
  if (!user) {
    return next(new AppError("No task found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
});

//EXPORT
module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
