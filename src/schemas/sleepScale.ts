import {z} from 'zod';

export const DisruptionEnum = z.enum([
  'back_pain',
  'hip_discomfort',
  'uncomfortable_position',
  'racing_thoughts',
  'bathroom_trips',
  'noise_or_light',
  'other',
]);

export const HelperEnum = z.enum([
  'side_sleeping',
  'heat_pad',
  'sleeping_pills',
  'breathwork',
  'no_screens',
  'herbal_tea',
  'white_noise',
  'stretching',
  'other',
]);

export const sleepScaleSchema = z.object({
  sleepQuality: z.enum([
    'terrible',
    'very_poor',
    'poor',
    'fair',
    'good',
    'excellent',
  ]),
  disruptions: z.array(DisruptionEnum).optional(),
  otherDisruption: z.string().optional(),
  helpers: z.array(HelperEnum).optional(),
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
