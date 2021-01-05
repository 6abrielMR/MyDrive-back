const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');

router.post('/upload', fileController.upload);
router.get('/download/:filenameFound', fileController.download);

module.exports = router;