const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    duration: { type: Number }, // in minutes
    restBetweenSets: { type: Number } // in seconds
  }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  targetMuscleGroups: [{ type: String }],
  estimatedDuration: { type: Number }, // in minutes
  requiredEquipment: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
