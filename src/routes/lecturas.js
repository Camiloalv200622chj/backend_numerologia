const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const lecturasController = require("../controllers/lecturasController");

const router = Router();

// Lectura principal
router.post("/principal/:usuario_id", [
  check("usuario_id", "ID de usuario inválido")
    .isMongoId(),

  validarCampos
], lecturasController.generarPrincipal);

// Lectura diaria
router.post("/diaria/:usuario_id", [
  check("usuario_id", "ID de usuario inválido")
    .isMongoId(),

  validarCampos
], lecturasController.generarDiaria);

// Obtener lecturas
router.get("/:usuario_id", [
  check("usuario_id", "ID de usuario inválido")
    .isMongoId(),

  validarCampos
], lecturasController.obtenerPorUsuario);

module.exports = router;