const handleResponse = function (res, status, message, data = null) {
  if (res.headersSent) return;
  return res.status(status).json({
    data,
    status,
    message,
  });
};

module.exports = handleResponse;
