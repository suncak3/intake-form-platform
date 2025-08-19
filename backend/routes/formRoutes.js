const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, formController.createForm);
router.get('/:id', authenticateUser, formController.getForm);
router.put('/:id', authenticateUser, formController.updateForm);

module.exports = router;