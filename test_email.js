
require('dotenv').config();
const { sendEmail } = require('./src/utils/sendEmail');

async function test() {
    console.log("Starting email test...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    // Mascarar contraseña
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "MISSING");

    try {
        await sendEmail({
            to: process.env.EMAIL_USER, // Enviar a sí mismo para prueba
            subject: "Prueba de Funcionamiento Oráculo App",
            html: "<h1>La prueba de correo funciona correctamente!</h1>"
        });
        console.log("Test successful!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
