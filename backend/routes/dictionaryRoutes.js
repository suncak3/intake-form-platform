const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

router.get('/genders', dictionaryController.getGenders);
router.get('/programming-languages', dictionaryController.getProgrammingLanguages);

router.post('/programming-languages', dictionaryController.createCustomLanguage);

module.exports = router;