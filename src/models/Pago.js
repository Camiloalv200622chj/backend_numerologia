const mongoose = require("mongoose");

const PagoSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  metodo: {
    type: String,
    required: true
  },
  fecha_pago: {
    type: Date,
    default: Date.now
  },
  fecha_vencimiento: {
    type: Date
  },
  referencia: {
    type: String,
    unique: true
  },
  estado: {
    type: String,
    enum: ["PENDING", "APPROVED", "DECLINED", "ERROR"],
    default: "PENDING"
  }
});

module.exports = mongoose.model("Pago", PagoSchema);
