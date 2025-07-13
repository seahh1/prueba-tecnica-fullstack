const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', asyncHandler(userController.createNewUser));

module.exports = router;