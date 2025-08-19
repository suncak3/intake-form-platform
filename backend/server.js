require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL успешно');

        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы');

        app.listen(PORT, () => {
            console.log(`Адрес: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Ошибка запуска сервера:');
        console.error('   ', error.message);

        process.exit(1);
    }
}

console.log('Запуск сервера');
startServer();