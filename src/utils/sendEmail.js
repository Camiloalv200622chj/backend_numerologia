const nodemailer = require("nodemailer");

// Configurar transporte Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Oráculo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Correo enviado a ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error);
    throw error;
  }
};

// ============================================
// 🔹 PLANTILLAS DE CORREO
// ============================================

const formatTextToHtml = (text) => {
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
};

const plantillaLecturaPrincipal = (nombre, textoLectura) => {
  const contenidoHtml = formatTextToHtml(textoLectura);
  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0f1016; color: #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
      <div style="background: linear-gradient(135deg, #4f2582 0%, #2f1754 100%); padding: 30px; text-align: center; border-bottom: 2px solid #b8860b;">
        <h1 style="color: #ffd700; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Tu Lectura Principal</h1>
      </div>
      <div style="padding: 40px 30px; background-image: radial-gradient(circle at 50% 0%, #1a1a2e 0%, #0f1016 100%); line-height: 1.8; font-size: 16px;">
        <h2 style="color: #c0a062; font-weight: normal; margin-top: 0;">Bienvenido/a, ${nombre}</h2>
        <p style="color: #a0a0b0; font-style: italic; margin-bottom: 30px;">
          Los astros y los números han hablado. Aquí tienes tu lectura principal, tu guía en este nuevo camino...
        </p>
        <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-left: 4px solid #b8860b; border-radius: 0 8px 8px 0; color: #e6e6e6;">
          ${contenidoHtml}
        </div>
        <p style="margin-top: 40px; text-align: center; color: #888;">
          Que el cosmos te acompañe siempre. <br>
          <strong>Equipo de Oráculo App</strong>
        </p>
      </div>
    </div>
  `;
};

const plantillaLecturaDiaria = (nombre, textoLectura) => {
  const contenidoHtml = formatTextToHtml(textoLectura);
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
      <div style="background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%); padding: 30px; text-align: center; border-bottom: 1px solid #ddd;">
        <h1 style="color: #444; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Lectura Diaria</h1>
        <p style="color: #777; margin: 10px 0 0 0; font-size: 14px;">${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div style="padding: 40px 30px; line-height: 1.6; font-size: 16px;">
        <h2 style="color: #2c3e50; font-weight: 400; font-size: 20px; margin-top: 0;">Hola, ${nombre}</h2>
        <p style="color: #555;">
          Esta es la energía que te acompaña el día de hoy:
        </p>
        <div style="background: #f9f9fc; padding: 25px; border-radius: 8px; color: #444; margin-top: 20px;">
          ${contenidoHtml}
        </div>
        <p style="margin-top: 40px; text-align: center; color: #999; font-size: 14px;">
          ¡Que tengas un excelente día! <br>
          <strong>Oráculo App</strong>
        </p>
      </div>
    </div>
  `;
};

const plantillaBienvenidaVIP = (nombre) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
      <div style="background: linear-gradient(120deg, #b8860b 0%, #ffd700 100%); padding: 30px; text-align: center; border-bottom: 1px solid #ddd;">
        <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">¡Bienvenido al VIP Ancestral!</h1>
      </div>
      <div style="padding: 40px 30px; line-height: 1.6; font-size: 16px;">
        <h2 style="color: #2c3e50; font-weight: 400; font-size: 20px; margin-top: 0;">Hola, ${nombre}</h2>
        <p style="color: #555;">
          Nos alegra confirmarte que tu pago se procesó de manera exitosa y que a partir de ahora, tienes acceso al selecto <strong>Plan VIP Ancestral</strong>.
        </p>
        <p style="color: #555;">
          A continuación, disfruta de todo el contenido, lecturas completas, y acceso total a nuestro portal para seguir descubriendo los misterios del cosmos.
        </p>
        <p style="margin-top: 40px; text-align: center; color: #999; font-size: 14px;">
          ¡Que tengas un excelente día! <br>
          <strong>Oráculo App</strong>
        </p>
      </div>
    </div>
  `;
};

module.exports = {
  sendEmail,
  plantillaLecturaPrincipal,
  plantillaLecturaDiaria,
  plantillaBienvenidaVIP
};
