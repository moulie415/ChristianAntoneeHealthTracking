import {z} from 'zod';

export const sleepScaleSchema = z.object({
  sleepQuality: z.enum(
    ['terrible', 'veryPoor', 'poor', 'fair', 'good', 'excellent'],
    {
      required_error: 'Please select how well you slept.',
    },
  ),
  disruptions: z.array(z.string()).optional(),
  otherDisruption: z.string().optional(),
  helpers: z.array(z.string()).optional(),
  otherHelper: z.string().optional(),
  wakeFeeling: z.enum(['energized', 'calm', 'neutral', 'groggy', 'tired'], {
    required_error: 'Please select how you felt on waking.',
  }),
  sleepDuration: z.enum(['<4', '4–6', '6–7', '7–8', '>8'], {
    required_error: 'Please select your estimated sleep duration.',
  }),
  wakeFrequency: z.enum(['0', '1–2', '3–4', '>4', 'countless'], {
    required_error: 'Please select your night wake-up frequency.',
  }),
  mentalState: z.enum(
    ['calm', 'slightlyStressed', 'anxious', 'alert', 'unknown'],
    {
      required_error: 'Please describe your mental state before bed.',
    },
  ),
});
