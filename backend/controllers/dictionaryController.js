const { Gender, ProgrammingLanguage } = require('../models');

class ReferenceController {
    async getGenders(req, res) {
        try {
            const genders = await Gender.findAll({
                order: [['name', 'ASC']]
            });
            res.json({ genders });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProgrammingLanguages(req, res) {
        try {
            const languages = await ProgrammingLanguage.findAll({
                order: [['is_predefined', 'DESC'], ['name', 'ASC']]
            });
            res.json({ programming_languages: languages });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createCustomLanguage(req, res) {
        try {
            const { name } = req.body;

            if (!name || name.trim().length === 0) {
                return res.status(400).json({ error: 'Название языка обязательно' });
            }

            const language = await ProgrammingLanguage.findOrCreate({
                where: { name: name.trim() },
                defaults: { name: name.trim(), is_predefined: false }
            });

            res.status(201).json({
                message: 'Язык программирования добавлен',
                programming_language: language[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReferenceController();