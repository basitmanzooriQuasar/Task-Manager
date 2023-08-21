// module.exports = (err, res) => {
//   //Operational, trusted error: send message to client

//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
//   //Programming or other unknown error: do not leak error details
//   //   else {
//   //     //1)log erro
//   //     console.error("ERROR 🚩🚩", err);
//   //     //2)send generic error message
//   //     res.status(500).json({
//   //       status: "error",
//   //       message: "Something went wrong",
//   //     });
//   //   }
// };
