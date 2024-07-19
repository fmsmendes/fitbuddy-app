const User = require('../models/User');

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.json(trainers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id).select('-password');
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const { name, email, password, specialties, experience } = req.body;
    
    let trainer = await User.findOne({ email });
    if (trainer) {
      return res.status(400).json({ message: 'Trainer already exists' });
    }

    trainer = new User({
      name,
      email,
      password,
      role: 'trainer',
      specialties,
      experience
    });

    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { name, specialties, experience } = req.body;
    const trainer = await User.findById(req.params.id);

    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    trainer.name = name || trainer.name;
    trainer.specialties = specialties || trainer.specialties;
    trainer.experience = experience || trainer.experience;

    await trainer.save();
    res.json(trainer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);

    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    await trainer.remove();
    res.json({ message: 'Trainer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
