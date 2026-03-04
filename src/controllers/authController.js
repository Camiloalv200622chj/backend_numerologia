const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");
const Usuario = require("../models/Usuario");


// =============================
// 🔹 LOGIN
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }

    if (usuario.estado !== "activo") {
      return res.status(403).json({
        msg: "Usuario inactivo. Contacte al administrador."
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        uid: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        plan: usuario.plan,
        estado: usuario.estado,
        fecha_nacimiento: usuario.fecha_nacimiento
      }
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error en el login",
      error: error.message
    });
  }
};


// =============================
// 🔹 SOLICITAR RECUPERACIÓN (CON ENVÍO DE CORREO)
// =============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({
        msg: "No existe un usuario con ese email"
      });
    }

    // Generar token
    const resetToken = crypto.randomBytes(20).toString("hex");

    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutos

    await usuario.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: usuario.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hola ${usuario.nombre},</p>
        <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expira en 15 minutos.</p>
      `
    });

    res.json({
      msg: "Correo de recuperación enviado"
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error al enviar correo",
      error: error.message
    });
  }
};


// =============================
// 🔹 RESET PASSWORD
// =============================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({
        msg: "Token inválido o expirado"
      });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;

    await usuario.save();

    res.json({
      msg: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error al resetear contraseña",
      error: error.message
    });
  }
};


module.exports = {
  login,
  forgotPassword,
  resetPassword
};