const express = require('express');

const {
    registerUser,
    loginUser,
    userProfile,
} = require('../controllers/userController')

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.get('/:id', userProfile );

module.exports = userRouter;