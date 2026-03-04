const cron = require("node-cron");
const Usuario = require("../models/Usuario");
const Lectura = require("../models/Lectura");
const { generarTexto } = require("../utils/aiSimulator");
const { sendEmail, plantillaLecturaDiaria } = require("../utils/sendEmail");

// Configurar para ejecutar todos los días a las 07:00 AM
// El formato es: minutos horas día-del-mes mes día-de-la-semana
const iniciarCronDiario = () => {
    cron.schedule("0 7 * * *", async () => {
        console.log("⏰ Ejecutando tarea diaria: Generación de Lecturas Diarias...");

        try {
            // Buscar todos los usuarios activos
            const usuariosActivos = await Usuario.find({ estado: "activo" });

            if (usuariosActivos.length === 0) {
                console.log("⏭️ No hay usuarios activos para generar lectura diaria.");
                return;
            }

            for (const usuario of usuariosActivos) {
                try {
                    // Generar el texto
                    const textoIA = await generarTexto({
                        nombre: usuario.nombre,
                        fecha_nacimiento: usuario.fecha_nacimiento,
                        tipo: "diaria"
                    });

                    // Guardar en la base de datos
                    await Lectura.create({
                        usuario: usuario._id,
                        tipo: "diaria",
                        contenido: textoIA
                    });

                    // Enviar correo
                    const htmlCorreo = plantillaLecturaDiaria(usuario.nombre, textoIA);
                    await sendEmail({
                        to: usuario.email,
                        subject: `Tu Lectura Diaria - ${new Date().toLocaleDateString('es-ES')}`,
                        html: htmlCorreo
                    });

                    console.log(`✅ Lectura enviada con éxito a: ${usuario.email}`);
                } catch (errUsuario) {
                    console.error(`❌ Error al procesar lectura para ${usuario.email}:`, errUsuario.message);
                    // Continuar con el siguiente usuario aunque este falle
                }
            }

            console.log("✅ Tarea diaria de lecturas completada.");
        } catch (errorGeneral) {
            console.error("❌ Error en la ejecución general de la tarea diaria:", errorGeneral);
        }
    });

    console.log("🕒 Cron Job de Lecturas Diarias programado (07:00 AM).");
};

module.exports = { iniciarCronDiario };
