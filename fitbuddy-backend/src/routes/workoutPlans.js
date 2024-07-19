const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/workoutPlanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, workoutPlanController.createWorkoutPlan);
router.get('/', workoutPlanController.getAllWorkoutPlans);
router.get('/:id', workoutPlanController.getWorkoutPlanById);
router.put('/:id', authMiddleware, workoutPlanController.updateWorkoutPlan);
router.delete('/:id', authMiddleware, workoutPlanController.deleteWorkoutPlan);

module.exports = router;
