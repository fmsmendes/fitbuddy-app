const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, age, gender, fitnessLevel, interests, availability, location, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, gender, fitnessLevel, interests, availability, location, bio },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getBuddies = async (req, res) => {
  try {
    const buddies = await User.find({ role: 'user' }).select('-password');
    res.json(buddies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
