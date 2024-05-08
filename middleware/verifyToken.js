const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    const returnData = { status: false, data: null, message: "Token not provided" }
    return res.status(404).json(returnData);
  }

  jwt.verify(token, 'RentEaseDbData', (err, decoded) => {
    if (err) {
      const returnData = { status: false, data: null, message: "Invalid token" }
      return res.status(404).json(returnData);
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;