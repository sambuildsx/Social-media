const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Register

async function register(req, res) {
  try {

    const { realName, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      realName,
      username,
      email,
      password: hashedPassword
    });


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.status(201).json({
      token,
      user: {
        id: user._id,
        realName: user.realName,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
}


//LOGIN 

async function login(req, res) {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

}

module.exports = {
  register,
  login
};