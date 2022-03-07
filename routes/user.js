var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/delete/:id', (req,res,next)=>{req.app.validateUser(req,res,next)}, userController.delete)

module.exports = router;
