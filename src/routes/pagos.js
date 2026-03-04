const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const pagosController = require("../controllers/pagosController");

const router = Router();

router.post("/", [
  check("usuario_id", "ID de usuario inválido")
    .isMongoId(),

  check("monto", "El monto debe ser un número mayor a 0")
    .isFloat({ min: 1 }),

  check("metodo", "Método de pago obligatorio")
    .not().isEmpty()
    .trim(),

  check("fecha_vencimiento", "Fecha inválida")
    .isISO8601()
    .toDate(),

  validarCampos
], pagosController.registrarPago);

router.post("/wompi-signature", [
  check("usuario_id", "ID de usuario inválido").isMongoId(),
  check("monto", "El monto debe ser numérico").isNumeric(),
  validarCampos
], pagosController.generarFirmaWompi);

router.post("/wompi-webhook", pagosController.webhookWompi);

// 🔹 Listar todos los pagos (SOLO ADMIN)
const auth = require("../middlewares/auth");
const esAdmin = require("../middlewares/esAdmin");
router.get("/", [auth, esAdmin], pagosController.listarPagos);

module.exports = router;