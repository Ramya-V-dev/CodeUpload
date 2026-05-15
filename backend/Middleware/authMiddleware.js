// // authMiddleware.js
// const jwt = require('jsonwebtoken');
// const config = require('../DBCONFIG/dbConfig');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, config.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;


// authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../DBCONFIG/dbConfig');

const authenticateToken = (req, res, next) => {
  console.log('Authenticating token...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token provided',req.headers['Authorization']);
    return res.sendStatus(404);
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.sendStatus(405);
    }
    console.log('Token verified successfully');
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

