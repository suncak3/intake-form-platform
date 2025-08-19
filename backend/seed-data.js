require('dotenv').config();
const { sequelize, Gender, ProgrammingLanguage } = require('./models');

async function seedData() {
    try {
        await sequelize.authenticate();

        const genders = [
            { name: 'Мужской', code: 'male' },
            { name: 'Женский', code: 'female' }
        ];

        for (const gender of genders) {
            await Gender.findOrCreate({
                where: { code: gender.code },
                defaults: gender
            });
        }

        const languages = [
            { name: 'Java', is_predefined: true },
            { name: 'Javascript', is_predefined: true },
            { name: 'PHP', is_predefined: true },
            { name: 'C++', is_predefined: true },
            { name: 'Python', is_predefined: true },
            { name: 'C#', is_predefined: true }
        ];

        for (const lang of languages) {
            await ProgrammingLanguage.findOrCreate({
                where: { name: lang.name },
                defaults: lang
            });
        }

    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        process.exit();
    }
}

seedData();