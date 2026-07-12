import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate Token helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || 'transitops_super_secret_jwt_key_12345',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const userExists = await User.findOne({ $or: query });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email: email || undefined,
      phone: phone || undefined,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user),
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user),
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: 'Incorrect old password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
