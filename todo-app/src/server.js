// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;
const DOMAIN = "172.28.0.238";

// Подключение к MongoDB
const DB_URL = "mongodb+srv://rudiviktor94:Cfy6SBizyU0fuQxP@cluster0.p8ojmyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Настройка парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, '../public')));


// Маршруты
const taskRoutes = require('../routes/taskRoutes');
app.use('/tasks', taskRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на ${DOMAIN}:${PORT}`);
});
