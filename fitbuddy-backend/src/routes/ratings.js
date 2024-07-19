const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ratingController.rateUser);
router.get('/:userId', ratingController.getUserRatings);

module.exports = router;
