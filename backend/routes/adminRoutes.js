const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/login', adminController.login);

router.get('/users', authenticateAdmin, adminController.getAllUsers);
router.get('/forms', authenticateAdmin, adminController.getAllForms);
router.get('/forms/:id', authenticateAdmin, adminController.getFormById);
router.put('/forms/:id', authenticateAdmin, adminController.updateForm);
router.delete('/forms/:id', authenticateAdmin, adminController.deleteForm);

module.exports = router;