require("dotenv").config();
const app = require("./app");
const conectarDB = require("./config/db");

conectarDB();

// 🔹 Inicializar cron jobs
const { iniciarCronDiario } = require("./cron/dailyReading");
iniciarCronDiario();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
