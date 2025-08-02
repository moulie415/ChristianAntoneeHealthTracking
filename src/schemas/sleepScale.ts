import {z} from 'zod';

export const sleepScaleSchema = z.object({
  sleepQuality: z.enum([
    'terrible',
    'very_poor',
    'poor',
    'fair',
    'good',
    'excellent',
  ]),
  disruptions: z.array(z.string()).optional(),
  otherDisruption: z.string().optional(),
  helpers: z.array(z.string()).optional(),
  otherHelper: z.string().optional(),
  wakeFeeling: z.enum(['energized', 'calm', 'neutral', 'groggy', 'tired']),
  sleepDuration: z.enum(['<4', '4–6', '6–7', '7–8', '>8']),
  wakeFrequency: z.enum(['0', '1–2', '3–4', '>4', 'countless']),
  mentalState: z.enum([
    'calm',
    'slightly_stressed',
    'anxious',
    'alert',
    'unknown',
  ]),
});
