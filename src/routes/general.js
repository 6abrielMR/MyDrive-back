const express = require('express');
const router = express.Router();

const generalController = require('../controllers/generalController');

router.post('/', generalController.all);
router.get('/delete', generalController.delete);
router.post('/move', generalController.move);
router.post('/rename', generalController.rename);

module.exports = router;