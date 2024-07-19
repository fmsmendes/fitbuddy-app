const WorkoutPlan = require('../models/WorkoutPlan');

exports.createWorkoutPlan = async (req, res) => {
  try {
    const newWorkoutPlan = new WorkoutPlan({
      ...req.body,
      creator: req.user.id
    });
    const savedWorkoutPlan = await newWorkoutPlan.save();
    res.status(201).json(savedWorkoutPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find().populate('creator', 'name');
    res.json(workoutPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getWorkoutPlanById = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id).populate('creator', 'name');
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }
    res.json(workoutPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }
    if (workoutPlan.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWorkoutPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }
    if (workoutPlan.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await workoutPlan.remove();
    res.json({ message: 'Workout plan removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
