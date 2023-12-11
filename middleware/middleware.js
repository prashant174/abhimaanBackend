const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized - No token provided' });
  }

  try {
   
    const decodedToken = jwt.verify(token, 'abhimaan');

    
    req.user = decodedToken;

    
    next();
  } catch (error) {
 
    return res.status(401).send({ msg: 'Unauthorized - Invalid token' });
  }
};

module.exports = {
    authentication
};