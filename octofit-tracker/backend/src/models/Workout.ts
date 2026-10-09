import { model, Schema } from 'mongoose';

const workoutSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  durationMinutes: { type: Number, required: true, min: 1 },
  exercises: [{ type: String, trim: true }],
}, { timestamps: true });

export default model('Workout', workoutSchema);