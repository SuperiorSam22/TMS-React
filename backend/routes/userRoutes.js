const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const {
    registerUser,
    loginUser,
    userProfile,
} = require('../controllers/userController')

const userRouter = express.Router();

userRouter
    .post('/register', registerUser);

userRouter
    .post('/login', loginUser);

userRouter
    .get('/profile', 
        // authMiddleware,
         userProfile );

module.exports = userRouter;