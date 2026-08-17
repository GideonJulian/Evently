const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          error: "Please provide name, email, and password",
        });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: "user", // Default role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response without password
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
