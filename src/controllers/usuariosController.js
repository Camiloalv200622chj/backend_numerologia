const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const Lectura = require("../models/Lectura");
const { generarTexto } = require("../utils/aiSimulator");
const { sendEmail, plantillaLecturaPrincipal } = require("../utils/sendEmail");


// =============================
// 🔹 CREAR USUARIO
// =============================
exports.crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      fecha_nacimiento,
      estado,
      rol
    } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email y password son obligatorios"
      });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({
        msg: "El usuario ya existe"
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario (incluye rol)
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      fecha_nacimiento,
      estado,
      rol   // 👈 AHORA SÍ SE GUARDA
    });

    // 🔹 GENERAR LECTURA PRINCIPAL Y ENVIAR CORREO
    try {
      const textoIA = await generarTexto({
        nombre: usuario.nombre,
        fecha_nacimiento: usuario.fecha_nacimiento,
        tipo: "principal"
      });

      await Lectura.create({
        usuario: usuario._id,
        tipo: "principal",
        contenido: textoIA
      });

      const htmlCorreo = plantillaLecturaPrincipal(usuario.nombre, textoIA);
      await sendEmail({
        to: usuario.email,
        subject: "¡Bienvenido/a! Aquí tienes tu Lectura Principal",
        html: htmlCorreo
      });
    } catch (err) {
      console.error("Error al generar/enviar lectura principal:", err);
      // No cortamos el flujo de registro si el correo/IA falla
    }

    res.json({
      msg: "Usuario creado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        plan: usuario.plan,
        estado: usuario.estado
      }
    });

  } catch (error) {
    console.error("ERROR CREAR USUARIO:", error);
    res.status(500).json({
      msg: "Error al crear usuario",
      error: error.message
    });
  }
};


// =============================
// 🔹 LISTAR USUARIOS (SOLO ADMIN)
// =============================
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      msg: "Error al listar usuarios",
      error: error.message
    });
  }
};


// =============================
// 🔹 ACTUALIZAR USUARIO (SOLO ADMIN)
// =============================
exports.actualizarUsuario = async (req, res) => {
  try {

    // Evitar que actualicen password directamente aquí
    if (req.body.password) {
      delete req.body.password;
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(usuario);

  } catch (error) {
    res.status(500).json({
      msg: "Error al actualizar usuario",
      error: error.message
    });
  }
};


// =============================
// 🔹 CAMBIAR ESTADO (SOLO ADMIN)
// =============================
exports.cambiarEstado = async (req, res) => {
  try {

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    ).select("-password");

    res.json(usuario);

  } catch (error) {
    res.status(500).json({
      msg: "Error al cambiar estado",
      error: error.message
    });
  }
};


// =============================
// 🔹 ELIMINAR USUARIO (SOLO ADMIN)
// =============================
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // (Opcional) Puedes eliminar las lecturas asociadas al usuario si lo deseas
    await Lectura.deleteMany({ usuario: req.params.id });

    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR USUARIO:", error);
    res.status(500).json({
      msg: "Error al eliminar usuario",
      error: error.message
    });
  }
};