require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Щось пішло не так!',
        message: err.message 
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Маршрут не знайдено'
    });
});
module.exports = app;