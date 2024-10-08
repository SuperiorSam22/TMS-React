const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//generate jwt
const generateToken = (id, role, name, email) => {
  const payload = {
    id,
    role,
    name,
    email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
    // algorithm: 'HS512', //use of different algorithm for encryption
  });
};

//Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    //check for existing user email
    const existingUser = await User.find({ email });
    if (!existingUser && existingUser.length > 0) {
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
        token: generateToken(user._id, user.role, user.name, user.email),
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
    const passBcrypt = await bcrypt.compare(password, user.password);
    if (!passBcrypt) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role, user.name, user.email),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed, please try again" });
    }

    res.clearCookie("connect.sid"); // Clears the session ID cookie
    res.status(200).json({ message: "Logout successful" });
  });
};


const getAllUsers = async (req, res) => {
  try {
      const users = await User.find({ role: 'user' }); // Assuming you have a 'role' field to distinguish between users and operators
      return res.status(200).json(users);
  } catch (error) {
      return res.status(500).json({ message: 'Error fetching users', error });
  }
};

const getAllOperators = async (req, res) => {
  try {
      const operators = await User.find({ role: 'operator' }); // Assuming you have a 'role' field to distinguish between users and operators
      return res.status(200).json(operators);
  } catch (error) {
      return res.status(500).json({ message: 'Error fetching operators', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
  getAllUsers,
  getAllOperators,
};
