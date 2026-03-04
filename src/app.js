const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const lecturasRoutes = require("./routes/lecturas");
const pagosRoutes = require("./routes/pagos");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//  RUTAS
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/lecturas", require("./routes/lecturas"));
app.use("/api/pagos", require("./routes/pagos"));
app.use("/api/auth", authRoutes);

module.exports = app;
