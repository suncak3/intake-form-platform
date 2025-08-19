const formService = require('../services/formService');
const { schemas } = require('../utils/validation');

class FormController {
    async createForm(req, res) {
        try {
            const { error } = schemas.createForm.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Ошибка валидации',
                    details: error.details.map(d => d.message)
                });
            }

            const form = await formService.createForm(req.body, req.user.id);
            res.status(201).json({
                message: 'Анкета создана успешно',
                form
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getForm(req, res) {
        try {
            const form = await formService.getFormById(req.params.id);

            if (form.user_id !== req.user.id) {
                return res.status(403).json({
                    error: 'Доступ запрещен. Вы можете просматривать только свои анкеты'
                });
            }

            res.json(form);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateForm(req, res) {
        try {
            const { error } = schemas.updateForm.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Ошибка валидации',
                    details: error.details.map(d => d.message)
                });
            }

            const form = await formService.updateForm(req.params.id, req.body, req.user.id);

            res.json({
                message: 'Анкета обновлена',
                form
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new FormController();