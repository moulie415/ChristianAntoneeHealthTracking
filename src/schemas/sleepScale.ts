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

export const SleepQualityEnum = z.enum([
  'terrible',
  'very_poor',
  'poor',
  'fair',
  'good',
  'excellent',
]);

export const WakeFeelingEnum = z.enum([
  'energized',
  'calm',
  'neutral',
  'groggy',
  'tired',
]);

export const SleepDurationEnum = z.enum(['<4', '4–6', '6–7', '7–8', '>8']);

export const WakeFrequencyEnum = z.enum(['0', '1–2', '3–4', '>4', 'countless']);

export const MentalStateEnum = z.enum([
  'calm',
  'slightly_stressed',
  'anxious',
  'alert',
  'unknown',
]);

export const sleepScaleSchema = z.object({
  sleepQuality: SleepQualityEnum,
  disruptions: z
    .array(DisruptionEnum)
    .min(1, 'Please select at least one option'),
  otherDisruption: z.string().optional(),
  helpers: z.array(HelperEnum).min(1, 'Please select at least one option'),
  otherHelper: z.string().optional(),
  wakeFeeling: WakeFeelingEnum,
  sleepDuration: SleepDurationEnum,
  wakeFrequency: WakeFrequencyEnum,
  mentalState: MentalStateEnum,
});
