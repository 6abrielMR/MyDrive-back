const express = require('express');
const router = express.Router();

const dirController = require('../controllers/dirController');

router.post('/create', dirController.create);

module.exports = router;