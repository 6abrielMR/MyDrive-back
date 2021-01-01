const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');

router.post('/', fileController.all);
router.get('/upload', fileController.upload);

module.exports = router;