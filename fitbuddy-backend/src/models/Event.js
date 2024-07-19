const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isFree: { type: Boolean, default: true },
  price: { type: Number },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
