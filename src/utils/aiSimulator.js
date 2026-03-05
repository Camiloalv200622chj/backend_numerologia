const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generarTexto = async ({ nombre, fecha_nacimiento, tipo }) => {
  try {
    let promptText = "";

    if (tipo === "principal") {
      promptText = `Eres un experto numerólogo, astrólogo y guía espiritual empático. Crea una lectura principal de numerología profunda y personalizada para ${nombre}, nacido(a) el ${new Date(fecha_nacimiento).toLocaleDateString()}. Incluye el cálculo del número de su camino de vida, número del alma y de personalidad, basándote en su nombre y fecha de nacimiento. Explica qué significan esos números, menciona sus talentos ocultos, y ofrécele una perspectiva inspiradora para su misión de vida. Tu tono debe ser místico, sabio y compasivo, pero también claro y directo. La lectura debe ser detallada, de al menos 3 párrafos.`;
    } else {
      promptText = `Eres un experto numerólogo y guía espiritual empático. Escribe una lectura corta diaria inspiradora para ${nombre}, nacido(a) el ${new Date(fecha_nacimiento).toLocaleDateString()}. Analiza brevemente cómo las energías universales de hoy interactúan con su esencia numerológica. Dale un consejo práctico y espiritual para aprovechar el día al máximo. Mantén un tono alentador y místico.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = "Instrucción del sistema: Eres un numerólogo experto y sabio espiritual.\n\n" + promptText;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Error en generarTexto (Gemini):", error);
    return "⚠️ El universo está experimentando interferencias. Por favor, intenta conectar nuevamente más tarde.";
  }
};