const mongoose = require("mongoose");

const lecturaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  tipo: {
    type: String,
    enum: ["principal", "diaria"],
    required: true
  },
  contenido: {
    type: Object, // 👈 porque guardas JSON de la IA
    required: true
  },
  fecha_lectura: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lectura", lecturaSchema);
