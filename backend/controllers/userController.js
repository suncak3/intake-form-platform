const userService = require('../services/userService');
const { schemas } = require('../utils/validation');

class UserController {
    async register(req, res) {
        try {
            const { error } = schemas.userRegister.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Ошибка валидации',
                    details: error.details.map(d => d.message)
                });
            }

            const result = await userService.register(req.body);
            res.status(201).json({
                message: 'Пользователь зарегистрирован',
                ...result
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { error } = schemas.userLogin.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Ошибка валидации',
                    details: error.details.map(d => d.message)
                });
            }

            const result = await userService.login(req.body);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            res.json({
                user: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyForms(req, res) {
        try {
            const forms = await userService.getMyForms(req.user.id);
            res.json({ forms });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();