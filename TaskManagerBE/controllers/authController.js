const { promisify } = require("util");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) if email and password actually exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //2) check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  // console.log(user.role);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect password or email", 401));
  }
  //3) if everything is okay, send token to client
  token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1)get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // 2) verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user stills exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to the token does not exist", 401)
    );
  }
  // 4)check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User changed password after the token was issued", 401)
    );
  }

  //GRANT access to the protected route
  req.user = freshUser;
  next();
});

//Restrict yo implement Authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have the permission to access this page", 403)
      );
    }
    next();
  };
};

//forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email address
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("User does not exist with this email address", 404)
    );
  }
  //2) Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to the user's email address
});

//reset password
const resetPassword = (req, res, next) => {};
module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
