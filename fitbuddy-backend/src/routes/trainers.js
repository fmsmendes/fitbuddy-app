const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);
router.post('/', authMiddleware, trainerController.createTrainer);
router.put('/:id', authMiddleware, trainerController.updateTrainer);
router.delete('/:id', authMiddleware, trainerController.deleteTrainer);

module.exports = router;
