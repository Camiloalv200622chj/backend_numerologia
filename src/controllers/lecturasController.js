const Lectura = require("../models/Lectura");
const Usuario = require("../models/Usuario");
const { generarTexto } = require("../utils/aiSimulator");

/* =====================
   LECTURA PRINCIPAL
===================== */
exports.generarPrincipal = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const existe = await Lectura.findOne({
      usuario: usuario_id,
      tipo: "principal"
    });

    if (existe) {
      return res.status(400).json({ error: "La lectura principal ya existe" });
    }

    const textoIA = await generarTexto({
      nombre: usuario.nombre,
      fecha_nacimiento: usuario.fecha_nacimiento,
      tipo: "principal"
    });

    const lectura = await Lectura.create({
      usuario: usuario_id,
      tipo: "principal",
      contenido: textoIA // 👈 TEXTO PLANO
    });

    res.json(lectura);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando lectura principal" });
  }
};

/* =====================
   LECTURA DIARIA
===================== */
exports.generarDiaria = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (usuario.estado !== "activo") {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    const textoIA = await generarTexto({
      nombre: usuario.nombre,
      fecha_nacimiento: usuario.fecha_nacimiento,
      tipo: "diaria"
    });

    const lectura = await Lectura.create({
      usuario: usuario_id,
      tipo: "diaria",
      contenido: textoIA // 👈 TEXTO PLANO
    });

    res.json(lectura);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando lectura diaria" });
  }
};

/* =====================
   OBTENER LECTURAS
===================== */
exports.obtenerPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  const lecturas = await Lectura.find({ usuario: usuario_id })
    .sort({ fecha_lectura: -1 });

  res.json(lecturas);
};
