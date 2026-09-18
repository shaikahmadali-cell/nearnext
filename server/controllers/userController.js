const User = require('../models/User');
const Business = require('../models/Business');

// @desc    Admin: Get all registered users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && req.user.id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await Business.deleteMany({ owner: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};
