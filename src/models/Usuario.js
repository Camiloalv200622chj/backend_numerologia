const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
    required: true
  },

  // 🔹 ROL
  rol: {
    type: String,
    enum: ["admin", "usuario"],
    default: "usuario"
  },

  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo"
  },

  // 🔹 PLAN
  plan: {
    type: String,
    enum: ["Free", "Premium", "VIP Ancestral"],
    default: "Free"
  },

  fecha_registro: {
    type: Date,
    default: Date.now
  },

  // 🔐 CAMPOS PARA RECUPERACIÓN DE CONTRASEÑA
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }

});

module.exports = mongoose.model("Usuario", UsuarioSchema);