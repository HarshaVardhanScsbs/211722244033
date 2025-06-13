const express = require('express');

const router = express.Router();

const { processNumberID } = require('../controllers/numberController');

router.get('/:numberid', processNumberID);

module.exports = router;
