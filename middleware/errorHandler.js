const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ?? 500;
  let title = "";
  switch (statusCode) {
    case constants.NOT_FOUND:
      title = "Not Found.";
      break;
    case constants.UNAUTHORIZED:
      title = "Unauthorized.";
      break;
    case constants.VALIDATION_ERROR:
      title = "Validation Error.";
      break;
    case constants.FORBIDDEN:
      title = "Forbidden.";
      break;
    case constants.SERVER_ERROR:
      title = "Server Error.";
      break;
    default:
      console.log("No Error, All Good.");
      break;
  }
  res.json({
    title,
    status: false,
    message: err.message,
    stackTrace: err.stack,
  });
};

module.exports = { errorHandler };
