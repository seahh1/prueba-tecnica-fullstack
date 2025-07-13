const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

router.post('/', asyncHandler(userController.createNewUser));

router.get('/me', protect, asyncHandler((req, res) => {
    res.status(200).json({ success: true, data: req.user });
}));

module.exports = router;