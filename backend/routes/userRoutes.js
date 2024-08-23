const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const {
    registerUser,
    loginUser,
    userProfile,
    logoutUser,
    getAllUsers,
    getAllOperators,
} = require('../controllers/userController')

const userRouter = express.Router();

userRouter
    .post('/register', registerUser);

userRouter
    .post('/login', loginUser);

userRouter
    .get('/profile', 
        authMiddleware,
         userProfile );

userRouter.post('/logout', logoutUser);

userRouter.get('/getUsers', getAllUsers)
userRouter.get('/getOperators',  getAllOperators)

module.exports = userRouter;