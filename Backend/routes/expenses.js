import express from 'express';
import Expense from '../models/Expense.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const formatExpense = (exp) => {
  const obj = exp.toJSON ? exp.toJSON() : exp;
  obj.vehicleRegNumber = exp.vehicleId ? exp.vehicleId.regNumber : '';
  return obj;
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('vehicleId')
      .sort({ date: -1, createdAt: -1 });

    res.json(expenses.map(formatExpense));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, type, amount, date, notes } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const expense = await Expense.create({
      vehicleId,
      type,
      amount,
      date,
      notes: notes || '',
    });

    const populatedExpense = await Expense.findById(expense._id).populate('vehicleId');
    res.status(201).json(formatExpense(populatedExpense));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
