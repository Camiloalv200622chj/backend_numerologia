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
app.use("/usuarios", usuariosRoutes);
app.use("/lecturas", require("./routes/lecturas"));
app.use("/pagos", require("./routes/pagos"));
app.use("/auth", authRoutes);

module.exports = app;
