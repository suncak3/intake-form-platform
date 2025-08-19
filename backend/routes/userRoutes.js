const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const formService = require('../services/formService');
const { authenticateUser } = require('../middleware/auth');
const { schemas } = require('../utils/validation');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', authenticateUser, userController.getProfile);
router.get('/forms', authenticateUser, userController.getMyForms);

router.put('/forms/:id', authenticateUser, async (req, res) => {
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
});

router.delete('/forms/:id', authenticateUser, async (req, res) => {
    try {
        const result = await formService.deleteForm(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;