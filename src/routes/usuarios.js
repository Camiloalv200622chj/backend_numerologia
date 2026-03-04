const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const usuariosController = require("../controllers/usuariosController");
const auth = require("../middlewares/auth");
const esAdmin = require("../middlewares/esAdmin");

const router = Router();


// =============================
// 🔹 CREAR USUARIO (PÚBLICO)
// =============================
router.post("/", [
  check("nombre", "El nombre es obligatorio")
    .not()
    .isEmpty()
    .trim(),

  check("email", "El correo no es válido")
    .isEmail()
    .normalizeEmail(),

  check("password", "La contraseña es obligatoria")
    .not()
    .isEmpty(),

  validarCampos
], usuariosController.crearUsuario);


// =============================
// 🔹 LISTAR USUARIOS (SOLO ADMIN)
// =============================
router.get("/", [
  auth,
  esAdmin
], usuariosController.listarUsuarios);


// =============================
// 🔹 ACTUALIZAR USUARIO (SOLO ADMIN)
// =============================
router.put("/:id", [
  auth,
  esAdmin,

  check("id", "ID inválido")
    .isMongoId(),

  validarCampos
], usuariosController.actualizarUsuario);


// =============================
// 🔹 CAMBIAR ESTADO (SOLO ADMIN)
// =============================
router.patch("/:id/estado", [
  auth,
  esAdmin,

  check("id", "ID inválido")
    .isMongoId(),

  check("estado", "El estado debe ser 'activo' o 'inactivo'")
    .isIn(["activo", "inactivo"]),

  validarCampos
], usuariosController.cambiarEstado);


// =============================
// 🔹 ELIMINAR USUARIO (SOLO ADMIN)
// =============================
router.delete("/:id", [
  auth,
  esAdmin,

  check("id", "ID inválido").isMongoId(),
  validarCampos
], usuariosController.eliminarUsuario);


module.exports = router;