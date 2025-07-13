const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/', userController.createNewUser);

router.use(protect);

router.get('/', userController.getUsers);

router
  .route('/:id')
  .get(userController.getUser) 
  .put(userController.updateUser) 
  .delete(userController.deleteUser);

module.exports = router;