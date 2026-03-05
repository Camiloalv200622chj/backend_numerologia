const Pago = require("../models/Pago");
const Usuario = require("../models/Usuario");
const crypto = require("crypto");
const { sendEmail, plantillaBienvenidaVIP } = require("../utils/sendEmail");

exports.registrarPago = async (req, res) => {
  try {
    const { usuario_id, monto, metodo, fecha_vencimiento } = req.body;

    // 1. Verificar usuario
    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2. Crear pago
    const pago = await Pago.create({
      usuario_id,
      monto,
      metodo,
      fecha_vencimiento
    });

    // 3. Activar usuario
    usuario.estado = "activo";
    await usuario.save();

    res.status(201).json({
      mensaje: "Pago registrado correctamente",
      pago
    });

  } catch (error) {
    console.error("❌ Error al registrar pago:", error);
    res.status(500).json({ error: "Error al registrar el pago" });
  }
};

exports.generarFirmaWompi = async (req, res) => {
  try {
    const { usuario_id, monto } = req.body;

    // Convertir monto a centavos
    const montoInCents = Math.round(monto * 100);
    const currency = "COP";
    const referencia = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
    const cadena = `${referencia}${montoInCents}${currency}${integrityKey}`;
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');

    // Registrar pago en estado PENDING
    await Pago.create({
      usuario_id,
      monto,
      metodo: "wompi",
      referencia,
      estado: "PENDING"
    });

    res.json({
      referencia,
      signature: hash,
      montoInCents,
      currency
    });
  } catch (error) {
    console.error("Error generando firma Wompi:", error);
    res.status(500).json({ error: "Error al generar firma Wompi" });
  }
};

exports.webhookWompi = async (req, res) => {
  try {
    console.log("Webhook Wompi recibido:", req.body);
    const event = req.body.event;

    if (event === "transaction.updated") {
      const transaction = req.body.data.transaction;
      const signature = req.body.signature;
      const timestamp = req.body.timestamp;

      // Validar checksum
      if (signature && signature.checksum) {
        const { id, status, amount_in_cents } = transaction;
        const eventsKey = process.env.WOMPI_EVENTS_KEY;
        const cadena = `${id}${status}${amount_in_cents}${timestamp}${eventsKey}`;
        const hash = crypto.createHash('sha256').update(cadena).digest('hex');

        if (hash !== signature.checksum) {
          console.warn("Checksum de Webhook Wompi no coincide");
          return res.status(400).send("Firma inválida");
        }
      }

      const { reference, status, payment_method_type } = transaction;
      const pago = await Pago.findOne({ referencia: reference });

      if (pago) {
        pago.estado = status;
        pago.metodo = payment_method_type || "wompi";
        await pago.save();

        // Si fue aprobado, activar al usuario y registrar la base de membresia o lectura
        if (status === "APPROVED") {
          const usuario = await Usuario.findById(pago.usuario_id);
          if (usuario) {
            usuario.estado = "activo";
            usuario.plan = "VIP Ancestral";
            await usuario.save();
            console.log(`Usuario ${usuario._id} activado y asignado al plan VIP Ancestral exitosamente mediante Wompi.`);

            // Enviar correo de bienvenida al VIP
            try {
              const htmlCorreo = plantillaBienvenidaVIP(usuario.nombre);
              await sendEmail({
                to: usuario.email,
                subject: "¡Bienvenido a VIP Ancestral! 🌟",
                html: htmlCorreo
              });
              console.log("Correo de bienvenida VIP enviado exitosamente a:", usuario.email);
            } catch (err) {
              console.error("Error al enviar correo de bienvenida VIP:", err);
            }
          }
        }
      } else {
        console.warn(`No se encontró pago para la referencia ${reference}`);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error en webhook Wompi:", error);
    res.status(500).send("Error procesando webhook");
  }
};

// =============================
// 🔹 LISTAR PAGOS (SOLO ADMIN)
// =============================
exports.listarPagos = async (req, res) => {
  try {
    const pagos = await Pago.find()
      .populate("usuario_id", "nombre email")
      .sort({ fecha_creacion: -1 });

    res.json(pagos);
  } catch (error) {
    console.error("❌ Error al listar pagos:", error);
    res.status(500).json({ error: "Error al listar los pagos" });
  }
};
