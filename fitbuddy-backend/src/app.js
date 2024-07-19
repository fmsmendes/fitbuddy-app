const express = require('express');                                                                                                               
 const mongoose = require('mongoose');                                                                                                             
 const cors = require('cors');                                                                                                                     
 require('dotenv').config();                                                                                                                       
                                                                                                                                                   
 const authRoutes = require('./routes/auth');                                                                                                      
 const userRoutes = require('./routes/users');                                                                                                     
 const eventRoutes = require('./routes/events');                                                                                                   
 const trainerRoutes = require('./routes/trainers');                                                                                               
 const workoutPlanRoutes = require('./routes/workoutPlans');                                                                                       
 const ratingRoutes = require('./routes/ratings');                                                                                                 
 const messageRoutes = require('./routes/messages');                                                                                               
                                                                                                                                                   
 const app = express();                                                                                                                            
                                                                                                                                                   
 // Middleware                                                                                                                                     
 app.use(cors());                                                                                                                                  
 app.use(express.json());                                                                                                                          
                                                                                                                                                   
 // Connect to MongoDB                                                                                                                             
 mongoose.connect(process.env.MONGODB_URI, {                                                                                                       
   useNewUrlParser: true,                                                                                                                          
   useUnifiedTopology: true,                                                                                                                       
 })                                                                                                                                                
 .then(() => console.log('Connected to MongoDB'))                                                                                                  
 .catch((err) => console.error('Could not connect to MongoDB', err));                                                                              
                                                                                                                                                   
 // Routes                                                                                                                                         
 app.use('/api/auth', authRoutes);                                                                                                                 
 app.use('/api/users', userRoutes);                                                                                                                
 app.use('/api/events', eventRoutes);                                                                                                              
 app.use('/api/trainers', trainerRoutes);                                                                                                          
 app.use('/api/workout-plans', workoutPlanRoutes);                                                                                                 
 app.use('/api/ratings', ratingRoutes);                                                                                                            
 app.use('/api/messages', messageRoutes);                                                                                                          
                                                                                                                                                   
 app.get('/', (req, res) => {                                                                                                                      
   res.send('FitBuddy API is running');                                                                                                            
 });                                                                                                                                               
                                                                                                                                                   
 // Start server                                                                                                                                   
 const PORT = process.env.PORT || 5000;                                                                                                            
 app.listen(PORT, () => {                                                                                                                          
   console.log(`Server is running on port ${PORT}`);                                                                                               
 });                                                                                                                                               
                                                                                                                                                   
 module.exports = app;          