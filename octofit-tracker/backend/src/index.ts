import cors from 'cors';
import express from 'express';
import mongoose, { type Model } from 'mongoose';
import './config/database.js';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const frontendOrigin = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173';

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

function listCollection<T>(collection: Model<T>) {
  return async (_request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      response.json(await collection.find().lean().exec());
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/users/', listCollection(User));
app.get('/api/teams/', listCollection(Team));
app.get('/api/activities/', listCollection(Activity));
app.get('/api/leaderboard/', listCollection(Leaderboard));
app.get('/api/workouts/', listCollection(Workout));

app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
  console.log(`OctoFit API listening at ${baseUrl}`);
});