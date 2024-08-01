import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { supabase, getCurrentSession, getCurrentUser } from './utils/supabase';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BuddyProfile from './components/BuddyProfile';
import EventDetail from './components/EventDetail';
import TrainerProfile from './components/TrainerProfile';
import UserMenu from './components/UserMenu';
import Notifications from './components/Notifications';
import UserProgress from './components/UserProgress';
import FindBuddy from './components/FindBuddy';
import EventsPage from './components/EventsPage';
import UserProfile from './components/UserProfile';
import TrainersPage from './components/TrainersPage';
import AllBuddiesPage from './components/AllBuddiesPage';
import AllEventsPage from './components/AllEventsPage';
import AllTrainersPage from './components/AllTrainersPage';
import BuddiesPage from './components/BuddiesPage';
import ExplorePage from './components/ExplorePage';
import MyEvents from './components/MyEvents';
import MyBookings from './components/MyBookings';
import PublicProfile from './components/PublicProfile';
import Membership from './components/Membership';
import Payment from './components/Payment';
import Settings from './components/Settings';
import HelpFeedback from './components/HelpFeedback';
import TrainerDashboard from './components/TrainerDashboard';
import TrainerClasses from './components/TrainerClasses';
import TrainerFinancials from './components/TrainerFinancials';
import TrainerChats from './components/TrainerChats';
import CreateClass from './components/CreateClass';
import TrainerSettings from './components/TrainerSettings';
import Clients from './components/Clients';
import AddCard from './components/AddCard';
import AddBankAccount from './components/AddBankAccount';
import AddClient from './components/AddClient';
import BookSession from './components/BookSession';
import CreateEvent from './components/CreateEvent';
import MessageBuddy from './components/MessageBuddy';
import ScheduleWorkoutPage from './components/ScheduleWorkoutPage';
import { useJsApiLoader } from '@react-google-maps/api';
import EditEvent from './components/EditEvent';

const libraries = ["places"];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Sample data (in a real app, this would likely come from an API)
  const buddyPhotos = [
    "https://qph.cf2.quoracdn.net/main-qimg-627475c39c374c65955002dca6694c03-lq",
    "https://static.standard.co.uk/s3fs-public/thumbnails/image/2017/03/13/10/joe-wicks.jpg?width=1200&height=1200&fit=crop",
    "https://hips.hearstapps.com/hmg-prod/images/whm030119feafitnessultimateplus1-011-1549559825.jpg",
    "https://pbs.twimg.com/profile_images/791726408015966209/XWXCfwT7_400x400.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
  ];

  const eventPhotos = [
    "https://media.licdn.com/dms/image/C5612AQFFGRG3sYIFHA/article-cover_image-shrink_720_1280/0/1626776936444?e=2147483647&v=beta&t=XdTIh2_J5MhrauY1ZHIzy-XIn7lQ7H4Wetx_L07KSXw",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F775195449%2F2140187722843%2F1%2Foriginal.png?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=f83690a4e697b1a320f1a3f76dffa005",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F398830899%2F419243453043%2F1%2Foriginal.20221123-160128?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C113%2C1980%2C990&s=2b98316791cc2ae1ba1b8a5edd652644",
    "https://visitelizabethcity.com//images/event_photos/Tarwheel2019_riverfront.jpg",
    "https://images.squarespace-cdn.com/content/v1/57df1997cd0f68d6292ff525/1555023797246-2DPLT1Z39LYNEDZXDGU6/conference_yoga.jpg",
  ];

  const trainerPhotos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSbr4cUT7voDlaJ61tNJSVdFBq3tY250eAg&s",
    "https://cms.exercise.com/wp-content/uploads/2022/03/julie-ledbetter-purple.png",
    "https://static.wixstatic.com/media/08bf13_4ae9334dcaf44430bb47a16d304d3a65~mv2.jpg/v1/fill/w_600,h_536,al_t,q_80,usm_0.66_1.00_0.01,enc_auto/08bf13_4ae9334dcaf44430bb47a16d304d3a65~mv2.jpg",
    "https://i0.wp.com/www.pictureperfectphoto.co.uk/wp-content/uploads/2022/11/GRAFT-HAUS-GYM-PHOTOSHOOT-LEEDS_109-1024x683.jpg?resize=1024%2C683&ssl=1",
    "https://img.freepik.com/premium-photo/personal-handsome-fitness-trainer-beautiful-blonde-female-client-gym-making-workout-schedule-program-healthy-life-concept_116317-9280.jpg",
  ];

  const buddies = [
    { id: 1, name: 'Jen Moore', age: 34, gender: 'Female', distance: 0.2, rating: 3.0, reviews: 15, image: buddyPhotos[0], interests: ['Running', 'Yoga'], level: 'Intermediate', availability: ['Morning', 'Evening'], workoutFrequency: '3-4 times/week' },
    { id: 2, name: 'Mark Zuckerberg', age: 40, distance: 1.6, rating: 4.5, reviews: 28, image: buddyPhotos[1] , interests: ['Cycling', 'Swimming'], level: 'Advanced', workoutFrequency: '5-6 times/week' },
    { id: 3, name: 'Sarah Connor', age: 29, distance: 3.1, rating: 4.2, reviews: 19, image: buddyPhotos[2], interests: ['CrossFit', 'Martial Arts'], level: 'Advanced', workoutFrequency: 'Daily' },
    { id: 4, name: 'John Doe', age: 45, distance: 0.8, rating: 3.8, reviews: 10, image: buddyPhotos[3], interests: ['Hiking', 'Meditation'], level: 'Intermediate', workoutFrequency: '2-3 times/week' },
    { id: 5, name: 'Emma Watson', age: 31, distance: 2.3, rating: 4.7, reviews: 33, image: buddyPhotos[4], interests: ['Pilates', 'Rock Climbing'], level: 'Expert', workoutFrequency: '4-5 times/week' },
  ];

  const events = [
    { id: 1, name: 'Morning Run', date: '2024-07-08', time: '6:43 AM', location: 'Surfers Paradise', participants: 10, image: eventPhotos[0], type: 'Running', isFree: true, host: { name: 'Sarah Runner', image: 'https://via.placeholder.com/50' } },
    { id: 2, name: 'Yoga in the Park', date: '2024-07-09', time: '8:00 AM', location: 'Central Park', participants: 15, image: eventPhotos[1], type: 'Yoga', isFree: false, price: 10, host: { name: 'Yogi Master', image: 'https://via.placeholder.com/50' } },
    { id: 3, name: 'HIIT Bootcamp', date: '2024-07-10', time: '7:30 AM', location: 'City Gym', participants: 20, image: eventPhotos[2], type: 'HIIT', isFree: false, price: 15, host: { name: 'Fitness Guru', image: 'https://via.placeholder.com/50' } },
    { id: 4, name: 'Cycling Tour', date: '2024-07-10', time: '9:00 AM', location: 'Coastal Route', participants: 25, image: eventPhotos[3], type: 'Cycling', isFree: true, host: { name: 'Cycle Pro', image: 'https://via.placeholder.com/50' } },
    { id: 5, name: 'Meditation Session', date: '2024-07-10', time: '6:00 PM', location: 'Zen Center', participants: 12, image: eventPhotos[4], type: 'Meditation', isFree: false, price: 5, host: { name: 'Mindfulness Expert', image: 'https://via.placeholder.com/50' } },
  ];

  const trainers = [
    { id: 1, name: 'James Dean', age: 36, distance: 0.2, rating: 4.8, reviews: 56, image: trainerPhotos[0], specialties: ['HIIT', 'Strength Training'], experience: '10 years', certifications: ['ACE', 'NASM'], availableDays: ['Mon', 'Wed', 'Fri'] },
    { id: 2, name: 'Sarah Thompson', age: 39, distance: 8.2, rating: 4.9, reviews: 72, image: trainerPhotos[1], specialties: ['Yoga', 'Pilates'], experience: '15 years', certifications: ['RYT-200', 'PMA-CPT'], availableDays: ['Tue', 'Thu', 'Sat'] },
    { id: 3, name: 'Mike Johnson', age: 42, distance: 3.5, rating: 4.7, reviews: 48, image: trainerPhotos[2], specialties: ['CrossFit', 'Nutrition'], experience: '12 years', certifications: ['CrossFit L3', 'ISSA Nutritionist'], availableDays: ['Mon', 'Tue', 'Thu', 'Fri'] },
    { id: 4, name: 'Emily Chen', age: 33, distance: 1.8, rating: 4.6, reviews: 39, image: trainerPhotos[3], specialties: ['Dance Fitness', 'Barre'], experience: '8 years', certifications: ['AFAA', 'Barre Above'], availableDays: ['Wed', 'Fri', 'Sat', 'Sun'] },
    { id: 5, name: 'Alex Rodriguez', age: 37, distance: 5.1, rating: 4.8, reviews: 61, image: trainerPhotos[4], specialties: ['Boxing', 'Functional Training'], experience: '11 years', certifications: ['USA Boxing Coach', 'NSCA-CPT'], availableDays: ['Mon', 'Tue', 'Wed', 'Fri'] },
  ];

  const defaultTrainer = {
    id: 'trainer1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'trainerpass123',
    role: 'trainer',
    age: 35,
    distance: 2.5,
    rating: 4.8,
    reviews: 120,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialties: ['Strength Training', 'HIIT', 'Nutrition'],
    experience: '10 years',
    certifications: ['ACE', 'NASM'],
    availableDays: ['Mon', 'Wed', 'Fri'],
    bio: "Hi, I'm John Doe, a certified personal trainer with 10 years of experience. I specialize in strength training, HIIT, and nutrition counseling. Let's work together to achieve your fitness goals!",
    stats: {
      totalClients: 150,
      activeClients: 42,
      classesCompleted: 520,
      onlineSessionsCompleted: 210,
      inPersonSessionsCompleted: 310,
      totalHoursWorked: 1560,
      avgSessionDuration: 60, // in minutes
      clientRetentionRate: 85, // percentage
      clientGoalsAchieved: 78, // percentage
      topPerformingClass: 'HIIT Bootcamp',
      monthlyEarnings: 5200, // in dollars
      yearToDateEarnings: 42000, // in dollars
      upcomingSessions: 8,
      lastMonthGrowth: 15, // percentage
    }
  };

  const [bookings] = useState([
    { id: 1, trainerName: 'James Dean', date: '2024-07-15', time: '10:00 AM', type: 'HIIT Session' },
    { id: 2, trainerName: 'Sarah Thompson', date: '2024-07-17', time: '2:00 PM', type: 'Yoga Class' },
  ]);

  const [currentPlan] = useState({
    name: 'Basic Plan',
    price: 19.99,
    renewalDate: '2024-08-01',
  });

  const [availablePlans] = useState([
    { id: 1, name: 'Basic Plan', price: 19.99, features: ['Access to app', '2 trainer sessions/month'] },
    { id: 2, name: 'Pro Plan', price: 39.99, features: ['Access to app', 'Unlimited trainer sessions', 'Nutrition planning'] },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', lastFour: '1234', expiryMonth: '12', expiryYear: '2025' },
  ]);

    const [transactions] = useState([
      { id: 1, description: 'Monthly Subscription', date: '2024-07-01', amount: 19.99, type: 'debit' },
      { id: 2, description: 'Personal Training Session', date: '2024-07-05', amount: 50.00, type: 'debit' },
    ]);
  
    const exploreData = {
      recommendations: [
        { type: 'buddy', title: 'Sarah J.', description: 'Shares your interest in yoga' },
        { type: 'event', title: 'Weekend Run', description: 'Join fellow runners this Saturday' },
        { type: 'trainer', title: 'Mike T.', description: 'Specializes in HIIT workouts' },
        { type: 'buddy', title: 'Alex M.', description: 'Looking for a cycling partner' },
      ],
      trendingActivities: [
        { name: 'Virtual Fitness Challenge', description: '30-day bodyweight workout series' },
        { name: 'Outdoor Yoga Sessions', description: 'Yoga classes in Central Park' },
      ],
      communityHighlights: {
        title: 'User Spotlight: John\'s Transformation',
        description: 'How John lost 30 pounds and gained confidence with FitBuddy',
      },
      localSpots: [
        { name: 'City Gym', address: '123 Fitness St, Cityville' },
        { name: 'Green Park Trail', address: 'Green Park, Nature Ave' },
      ],
      fitnessArticles: [
        { title: '5 Quick Workouts for Busy Professionals', summary: 'Stay fit with these time-efficient routines' },
        { title: 'Nutrition Tips for Muscle Gain', summary: 'Eat right to support your strength training' },
      ],
      trendingTrainers: [
        { name: 'Emma S.', specialty: 'Yoga & Pilates', rating: 4.9, reviewCount: 120 },
        { name: 'Jack R.', specialty: 'Strength & Conditioning', rating: 4.8, reviewCount: 95 },
        { name: 'Mia L.', specialty: 'HIIT & Cardio', rating: 4.7, reviewCount: 88 },
        { name: 'Tom K.', specialty: 'Bodyweight Training', rating: 4.9, reviewCount: 105 },
      ],
      localAds: [
        { title: 'FreshMeal Prep', description: 'Healthy meals delivered to your door', link: 'https://freshmealprep.com' },
        { title: 'GreenJuice Co.', description: 'Organic cold-pressed juices', link: 'https://greenjuice.com' },
        { title: 'FitGear Store', description: '20% off on all workout equipment', link: 'https://fitgearstore.com' },
        { title: 'Zen Yoga Studio', description: 'First class free for new members', link: 'https://zenyoga.com' },
      ],
    };
  
    useEffect(() => {
      let mounted = true;
  
      async function checkAuth() {
        try {
          const session = await getCurrentSession();
          if (mounted) {
            setIsAuthenticated(!!session);
            if (session) {
              const user = await getCurrentUser();
              if (user && user.id) {
                const { data: profile, error } = await supabase
                  .from('user_profiles')
                  .select('role')
                  .eq('id', user.id)
                  .single();
                
                if (error) throw error;
                
                setCurrentUser({ ...user, role: profile?.role });
              }
            }
          }
        } catch (error) {
          console.error('Error checking auth:', error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
  
      checkAuth();
  
      return () => {
        mounted = false;
      };
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }
   
    function TrainerProfileWrapper({ trainers, currentUser, isViewerTrainer }) {
      const { id } = useParams();
      const trainer = trainers.find(t => t.id === parseInt(id));
      return <TrainerProfile 
        trainer={trainer} 
        currentUser={currentUser}
        isViewerTrainer={isViewerTrainer}
      />;
    }
    return (
      
      <Router>
        <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            currentUser?.role === 'trainer' ? 
              <TrainerDashboard trainer={currentUser} setIsAuthenticated={setIsAuthenticated} /> :
              <Dashboard 
                buddies={buddies} 
                events={events} 
                trainers={trainers} 
                currentUser={currentUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : <LandingPage />
          } />
          <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : 
          <Login 
            setIsAuthenticated={setIsAuthenticated}
            setCurrentUser={setCurrentUser}
          />
        } />
          <Route path="/dashboard" element={
            isAuthenticated ? (
              currentUser.role === 'trainer' ? 
                <TrainerDashboard trainer={currentUser} setIsAuthenticated={setIsAuthenticated} /> :
                <Dashboard 
                buddies={buddies} 
                events={events} 
                trainers={trainers} 
                currentUser={currentUser}
                setIsAuthenticated={setIsAuthenticated}
                />
            ) : <Navigate to="/login" />
          } />
          <Route path="/trainer/:id" 
            element={isAuthenticated ? (
              <TrainerProfileWrapper 
                trainers={trainers} 
                currentUser={currentUser}
                isViewerTrainer={currentUser.role === 'trainer'}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route 
            path="/trainer-profile" 
            element={
              isAuthenticated && currentUser?.role === 'trainer' ? (
                <TrainerProfile 
                  trainer={currentUser}
                  currentUser={currentUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/buddy/:id" element={
            isAuthenticated ? <BuddyProfile buddies={buddies} /> : <Navigate to="/login" />
          } />
          <Route path="/event/:id" element={
            isAuthenticated ? <EventDetail events={events} /> : <Navigate to="/login" />
          } />
          <Route path="/notifications" element={
            isAuthenticated ? <Notifications /> : <Navigate to="/login" />
          } />
          <Route path="/progress" element={
            isAuthenticated ? <UserProgress /> : <Navigate to="/login" />
          } />
          <Route path="/find-buddy" element={
            isAuthenticated ? <FindBuddy buddies={buddies} /> : <Navigate to="/login" />
          } />
          <Route path="/events" element={
            isAuthenticated ? <EventsPage events={events} /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? (
              <UserProfile 
                user={{
                  ...currentUser,
                  fitnessLevel: 'Intermediate',
                  joinDate: '2023-01-01',
                  interests: ['Running', 'Yoga', 'Weightlifting'],
                  availability: ['Morning', 'Evening'],
                  fitnessGoals: ['Lose weight', 'Build muscle', 'Improve endurance'],
                  dob: '1990-01-01',
                  stats: {
                    eventsAttended: 10,
                    buddiesConnected: 5,
                    hoursExercised: 30,
                    achievementsEarned: 3,
                    likesReceived: 25
                  },
                  recentActivity: [
                    { type: 'event', name: 'Morning Run', date: '2024-07-05' },
                    { type: 'connection', name: 'Connected with Sarah', date: '2024-07-03' },
                    { type: 'achievement', name: 'Completed 10 workouts', date: '2024-07-01' }
                  ]
                }} 
                setIsAuthenticated={setIsAuthenticated}
                updateUser={(updatedUser) => {
                  console.log('Updating user:', updatedUser);
                  setCurrentUser(prevUser => ({...prevUser, ...updatedUser}));
                }}
              />
            ) : <Navigate to="/login" />
          } />
          <Route path="/trainers" element={
            isAuthenticated ? <TrainersPage trainers={trainers} /> : <Navigate to="/login" />
          } />
          <Route path="/all-buddies" element={
            isAuthenticated ? <AllBuddiesPage buddies={buddies} /> : <Navigate to="/login" />
          } />
          <Route path="/all-events" element={
            isAuthenticated ? <AllEventsPage events={events} /> : <Navigate to="/login" />
          } />
          <Route path="/all-trainers" element={
            isAuthenticated ? <AllTrainersPage trainers={trainers} /> : <Navigate to="/login" />
          } />
          <Route 
            path="/trainer-settings" 
            element={
              isAuthenticated && currentUser.role === 'trainer' ? (
                <TrainerSettings 
                  trainer={currentUser}
                  updateTrainer={(newSettings) => {
                    // Function to update trainer settings
                    // This could involve making an API call and then updating your app's state
                  }}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/buddies" element={
            isAuthenticated ? <BuddiesPage connectedBuddies={buddies} /> : <Navigate to="/login" />
          } />
          <Route path="/message-buddy/:id" element={
            isAuthenticated ? <MessageBuddy buddies={buddies} /> : <Navigate to="/login" />
          } />
          <Route path="/schedule-workout/:buddyId" element={
            isAuthenticated ? <ScheduleWorkoutPage /> : <Navigate to="/login" />
          } />
          <Route path="/explore" element={
            isAuthenticated ? (
              <ExplorePage
                user={currentUser}
                recommendations={exploreData.recommendations}
                trendingActivities={exploreData.trendingActivities}
                communityHighlights={exploreData.communityHighlights}
                localSpots={exploreData.localSpots}
                fitnessArticles={exploreData.fitnessArticles}
                trendingTrainers={exploreData.trendingTrainers}
                localAds={exploreData.localAds}
              />
            ) : <Navigate to="/login" />
          } />
          <Route path="/my-events" element={
            isAuthenticated ? <MyEvents events={events} /> : <Navigate to="/login" />
          } />
          <Route path="/my-bookings" element={
            isAuthenticated ? <MyBookings bookings={bookings} /> : <Navigate to="/login" />
          } />
          <Route path="/public-profile" element={
            isAuthenticated ? <PublicProfile user={currentUser} /> : <Navigate to="/login" />
          } />
          <Route path="/membership" element={
            isAuthenticated ? <Membership currentPlan={currentPlan} availablePlans={availablePlans} /> : <Navigate to="/login" />
          } />
          <Route path="/payment" element={
            isAuthenticated ? (
              <Payment 
                paymentMethods={paymentMethods} 
                transactions={transactions} 
                onAddPaymentMethod={(newMethod) => {
                  console.log('New payment method:', newMethod);
                  const newPaymentMethod = {
                    id: paymentMethods.length + 1,
                    type: 'Credit Card',
                    lastFour: newMethod.cardNumber.slice(-4),
                    expiryMonth: newMethod.expiryMonth,
                    expiryYear: newMethod.expiryYear
                  };
                  setPaymentMethods([...paymentMethods, newPaymentMethod]);
                }}
              />
            ) : <Navigate to="/login" />
          } />
          <Route path="/settings" element={
            isAuthenticated ? <Settings user={currentUser} /> : <Navigate to="/login" />
          } />
          <Route path="/help-feedback" element={
            isAuthenticated ? <HelpFeedback /> : <Navigate to="/login" />
          } />
          <Route path="/trainer-dashboard" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <TrainerDashboard trainer={currentUser} setIsAuthenticated={setIsAuthenticated} /> :
            <Navigate to="/login" />
          } />
          <Route path="/trainer-classes" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <TrainerClasses trainer={currentUser} /> :
            <Navigate to="/login" />
          } />
          <Route path="/create-class" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <CreateClass /> :
            <Navigate to="/login" />
          } />
          <Route path="/create-event" element={
            isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />
          } />
          <Route path="/trainer-financials" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <TrainerFinancials trainer={currentUser} /> :
            <Navigate to="/login" />
          } />
          <Route path="/trainer-chats" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <TrainerChats trainer={currentUser} /> :
            <Navigate to="/login" />
          } />
          <Route path="/clients" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <Clients /> :
            <Navigate to="/login" />
          } />
          <Route path="/add-card" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <AddCard /> :
            <Navigate to="/login" />
          } />
          <Route path="/add-bank-account" element={
            isAuthenticated && currentUser.role === 'trainer' ?
            <AddBankAccount /> :
            <Navigate to="/login" />
          } />
          <Route path="/trainer/:id/classes" element={
            isAuthenticated ? <TrainerClasses isTrainer={currentUser.role === 'trainer'} /> : <Navigate to="/login" />
          } />
          <Route path="/trainer/:id/book-session" element={
            isAuthenticated ? <BookSession /> : <Navigate to="/login" />
          } />
          <Route path="/edit-event/:id" element={<EditEvent />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;
