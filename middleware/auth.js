const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.error('Error to verifity token: ', err);
      return next(403);
    }

    // TODO: Verify user identity using `decodeToken.uid`
    req.decodedToken = decodedToken;
    // console.log('Content token decoded: ', decodedToken);
    next();
  });
};

module.exports.isAuthenticated = (req) => {
  // TODO: Decide based on the request information whether the user is authenticated
  if (req.decodedToken && req.decodedToken.uid) {
    console.log("uid", req.decodedToken.uid);
    return true;
  }
  return false;
};

module.exports.isAdmin = (req) => {
  // TODO: Decide based on the request information whether the user is an admin
  if (req.decodedToken.role === 'admin') {
    return true;
  }
  return false;
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
