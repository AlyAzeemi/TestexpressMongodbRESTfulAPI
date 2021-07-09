const isEmpty = require("../utils/is-empty");
const sendResponseOnlyWithMessage = (res, success, message, code) => {
  res.status(code).send({
    success: success,
    message: message,
  });
};

const sendResponseWithDataAndMessage = (res, success, message, data, code) => {
  res.status(code).send({
    success: success,
    message: message,
    data: data,
  });
};

const errorResponse = (res, message, code) => {
  return res.status(code).send({ errors: [{ message: message }] });
};

const errorResponseWithOnlyMessage = (res, e) => {
  if (!isEmpty(e) && e !== undefined) {
    return res.status(401).send({ success: false, message: e });
  } else {
    return res
      .status(500)
      .send({ success: false, message: "internel server error" });
  }
};

module.exports = {
  sendResponseOnlyWithMessage,
  sendResponseWithDataAndMessage,
  errorResponse,
  errorResponseWithOnlyMessage,
};
