const { Router } = require("express");
const { login, forgotPassword, resetPassword } = require("../controllers/authController");
const auth = require("../middlewares/auth");
const Usuario = require("../models/Usuario");

const router = Router();

// 🔹 Login
router.post("/login", login);

// 🔹 Validar token y obtener usuario actual
router.get("/me", auth, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.uid).select("-password");
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json({ usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, estado: usuario.estado, fecha_nacimiento: usuario.fecha_nacimiento } });
    } catch (e) {
        res.status(500).json({ msg: "Error validando sesión" });
    }
});

// 🔹 Solicitar recuperación
router.post("/forgot-password", forgotPassword);

// 🔹 Resetear contraseña
router.post("/reset-password/:token", resetPassword);

module.exports = router;