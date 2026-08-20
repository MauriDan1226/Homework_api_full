require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const {
  PORT = 3001,
  MONGO_URI = 'mongodb://127.0.0.1:27017/taskmanager',
  JWT_SECRET,
  CORS_ORIGIN,
} = process.env;

if (!JWT_SECRET) {
  console.error('Falta la variable de entorno JWT_SECRET. Copia .env.example a .env y completala.');
  process.exit(1);
}

const app = express();

const allowedOrigins = (CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.send({ status: 'ok', uptime: process.uptime() });
});

app.use(routes);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error('No fue posible conectar con MongoDB:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
