const esAdmin = (req, res, next) => {

  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar rol sin validar token primero"
    });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      msg: "No tiene permisos de administrador"
    });
  }

  next();
};

module.exports = esAdmin;