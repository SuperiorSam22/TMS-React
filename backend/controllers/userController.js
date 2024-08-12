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
  const { 
    name,
    email,
    password,
    role
  } = req.body;

  try {
    //check for existing user email
    const existingUser = await User.find({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
      console.log("Created user: " + user);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//authenticate a user and get token
//route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '10h',
          });
    const passBcrypt = await bcrypt.compare(password, user.password);
    if (!passBcrypt) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
    console.log(user);
    console.log(token);
  } catch (error) {
    console.log(error)
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
      console.log(error);
        res.status(500).json({message: "server error"});
    }
}

const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed, please try again' });
    }

    res.clearCookie('connect.sid'); // Clears the session ID cookie
    res.status(200).json({ message: 'Logout successful' });
  });
}

module.exports = {
    registerUser,
    loginUser,
    userProfile,
    logoutUser
}