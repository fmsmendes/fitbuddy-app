const Rating = require('../models/Rating');
const User = require('../models/User');

exports.rateUser = async (req, res) => {
  try {
    const { ratedUserId, rating, review } = req.body;
    const rater = req.user.id;

    // Check if the user has already rated this user
    const existingRating = await Rating.findOne({ rater, rated: ratedUserId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user' });
    }

    const newRating = new Rating({
      rater,
      rated: ratedUserId,
      rating,
      review
    });

    await newRating.save();

    // Update the user's ratings and average rating
    const ratedUser = await User.findById(ratedUserId);
    ratedUser.ratings.push({ rater, rating, review });
    const totalRatings = ratedUser.ratings.length;
    const ratingSum = ratedUser.ratings.reduce((sum, r) => sum + r.rating, 0);
    ratedUser.averageRating = ratingSum / totalRatings;
    await ratedUser.save();

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const ratings = await Rating.find({ rated: userId }).populate('rater', 'name');
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
