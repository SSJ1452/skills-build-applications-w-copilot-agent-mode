import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'alex.morgan', email: 'alex.morgan@example.com', displayName: 'Alex Morgan' },
      { username: 'jamie.chen', email: 'jamie.chen@example.com', displayName: 'Jamie Chen' },
      { username: 'sam.rivera', email: 'sam.rivera@example.com', displayName: 'Sam Rivera' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Trailblazers', members: [users[0]._id, users[1]._id] },
      { name: 'Morning Miles', members: [users[2]._id] },
    ]);

    await Activity.insertMany([
      { user: users[0]._id, activityType: 'Run', durationMinutes: 35, distanceKm: 5.2, calories: 360 },
      { user: users[0]._id, activityType: 'Strength', durationMinutes: 45, calories: 280 },
      { user: users[1]._id, activityType: 'Cycling', durationMinutes: 50, distanceKm: 18.4, calories: 420 },
      { user: users[1]._id, activityType: 'Walk', durationMinutes: 30, distanceKm: 2.6, calories: 130 },
      { user: users[2]._id, activityType: 'Run', durationMinutes: 28, distanceKm: 4.1, calories: 295 },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: teams[0]._id, period: 'weekly', points: 640, rank: 1 },
      { user: users[1]._id, team: teams[0]._id, period: 'weekly', points: 510, rank: 2 },
      { user: users[2]._id, team: teams[1]._id, period: 'weekly', points: 475, rank: 3 },
    ]);

    await Workout.insertMany([
      {
        title: 'Easy Run',
        description: 'A relaxed aerobic run at a conversational pace.',
        difficulty: 'beginner',
        durationMinutes: 30,
        exercises: ['Warm-up walk', 'Easy jog', 'Cool-down walk'],
      },
      {
        title: 'Full-body Strength',
        description: 'A balanced strength session using bodyweight movements.',
        difficulty: 'intermediate',
        durationMinutes: 40,
        exercises: ['Squats', 'Push-ups', 'Reverse lunges', 'Plank'],
      },
      {
        title: 'Cycling Intervals',
        description: 'Short cycling efforts with easy recovery periods.',
        difficulty: 'intermediate',
        durationMinutes: 35,
        exercises: ['Easy ride', 'Four-minute intervals', 'Cool-down ride'],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
