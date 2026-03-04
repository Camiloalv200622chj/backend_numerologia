const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({
        msg: "No hay token en la petición"
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos toda la info del token
    req.usuario = payload;

    next();

  } catch (error) {
    return res.status(401).json({
      msg: "Token no válido"
    });
  }
};

module.exports = auth;