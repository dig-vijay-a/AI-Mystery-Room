import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    alibi: { type: String, required: true },
    motive: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { _id: false }
);

const ClueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['forensic', 'testimony', 'documentary', 'physical'],
      default: 'forensic',
    },
    description: { type: String, required: true },
    discovered: { type: Boolean, default: false },
    discoveredAt: { type: Date },
  },
  { _id: false }
);

const HintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    order: { type: Number, required: true },
    text: { type: String, required: true },
    revealed: { type: Boolean, default: false },
    revealedAt: { type: Date },
  },
  { _id: false }
);

const SolutionSchema = new mongoose.Schema(
  {
    culpritId: { type: String, required: true },
    culpritName: { type: String, required: true },
    motive: { type: String, required: true },
    fatalFlaw: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const ScoreSchema = new mongoose.Schema(
  {
    base: { type: Number, default: 0 },
    cluesBonus: { type: Number, default: 0 },
    hintsDeduction: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const AccusationSchema = new mongoose.Schema(
  {
    suspectId: { type: String },
    suspectName: { type: String },
    reasoning: { type: String },
    isCorrect: { type: Boolean },
    accusedAt: { type: Date },
  },
  { _id: false }
);

const CaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    premise: { type: String },
    theme: { type: String, default: 'classic noir' },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      default: 'medium',
    },
    story: {
      setting: { type: String, required: true },
      victim: { type: String, required: true },
      crimeScene: { type: String, required: true },
      timeOfDeath: { type: String, required: true },
      narrative: { type: String, required: true },
    },
    suspects: [SuspectSchema],
    clues: [ClueSchema],
    hints: [HintSchema],
    solution: { type: SolutionSchema, required: true },
    status: {
      type: String,
      enum: ['investigating', 'solved', 'failed'],
      default: 'investigating',
    },
    accusation: AccusationSchema,
    score: { type: ScoreSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Case = mongoose.model('Case', CaseSchema);
