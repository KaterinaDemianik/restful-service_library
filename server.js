const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('підключено MongoDB');
}).catch(err => {
    console.error('помилка підключення MongoDB:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`сервер працює на ${PORT}`);
});