import { z } from 'zod';

export const CreateCaseInputSchema = z.object({
  premise: z.string().max(1000).optional().default(''),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  theme: z.string().max(100).optional().default('classic noir'),
});

export const AccusationInputSchema = z.object({
  suspectId: z.string().min(1, 'Suspect ID is required'),
  reasoning: z.string().max(2000).optional().default(''),
});

export const MysteryGenerationSchema = z.object({
  title: z.string().min(3),
  story: z.object({
    setting: z.string(),
    victim: z.string(),
    crimeScene: z.string(),
    timeOfDeath: z.string(),
    narrative: z.string(),
  }),
  suspects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      alibi: z.string(),
      motive: z.string(),
    })
  ).min(3),
  clues: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.enum(['forensic', 'testimony', 'documentary', 'physical']).default('forensic'),
      description: z.string(),
    })
  ).min(5),
  hints: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      text: z.string(),
    })
  ).min(2),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    motive: z.string(),
    fatalFlaw: z.string(),
    explanation: z.string(),
  }),
});
