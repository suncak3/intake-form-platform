const adminService = require('../services/adminService');
const { schemas } = require('../utils/validation');

class AdminController {
    async login(req, res) {
        try {
            const { error } = schemas.userLogin.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Ошибка валидации',
                    details: error.details.map(d => d.message)
                });
            }

            const result = await adminService.login(req.body);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await adminService.getAllUsers(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllForms(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await adminService.getAllForms(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getFormById(req, res) {
        try {
            const form = await adminService.getFormById(req.params.id);
            res.json(form);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateForm(req, res) {
        try {
            const form = await adminService.updateForm(req.params.id, req.body);
            res.json({
                message: 'Анкета обновлена',
                form
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteForm(req, res) {
        try {
            const result = await adminService.deleteForm(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new AdminController();