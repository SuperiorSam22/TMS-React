const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
    // algorithm: 'HS512', //use of different algorithm for encryption
  });
};

//Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    //check for existing user email
    const existingUser = await User.find({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (User) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

//authenticate a user and get token
//route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check for user email
    const user = await User.find({ email });
    // const passBcrypt = await bcrypt.compare(password, user.password);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // token: generateToken(user._id),
      });
      console.log(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};


const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'user not found'});
        }

    } catch (error) {
        res.status(500).json({message: "server error"});
    }
}

module.exports = {
    registerUser,
    loginUser,
    userProfile,
}