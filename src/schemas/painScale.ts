import { z } from 'zod';

// Define reusable enums first
export const PainLocationEnum = z.enum([
  'lower_back_centered',
  'lower_back_one_side',
  'glute_area',
  'hamstring',
  'calf_or_foot',
  'numbness_or_tingling',
]);
export const PainTypeEnum = z.enum([
  'sharp_stabbing',
  'dull_aching',
  'burning',
  'tingling_or_numbness',
  'radiating_down_leg',
]);
export const WorsenEnum = z.enum([
  'sitting_too_long',
  'poor_sleep',
  'lifting_bending',
  'stress_anxiety',
  'movement_or_exercise',
  'nothing_specific',
  'other',
]);
export const RelieveEnum = z.enum([
  'gentle_movement',
  'walking',
  'stretching',
  'breathing_relaxing',
  'heat_cold_therapy',
  'medication',
  'other',
]);
export const MoodEnum = z.enum([
  'hopeful',
  'accepting',
  'frustrated',
  'anxious',
  'helpless',
]);

// Schema using enums
export const painScaleSchema = z.object({
  painLocations: z.array(PainLocationEnum).min(1, 'Select at least one area of pain'),
  painIntensity: z.number().int().min(0).max(10),
  painTypes: z.array(PainTypeEnum).min(1, 'Select at least one pain type'),

  painWorsenedBy: z.object({
    reasons: z.array(WorsenEnum),
    otherReason: z.string().optional().or(z.literal('')),
  }).refine(
    (data) => !data.reasons.includes('other') || (data.otherReason && data.otherReason.trim() !== ''),
    { message: 'Please specify the other reason', path: ['otherReason'] }
  ),

  painRelievedBy: z.object({
    methods: z.array(RelieveEnum),
    otherMethod: z.string().optional().or(z.literal('')),
  }).refine(
    (data) => !data.methods.includes('other') || (data.otherMethod && data.otherMethod.trim() !== ''),
    { message: 'Please specify the other method', path: ['otherMethod'] }
  ),

  emotionalState: z.object({
    mood: MoodEnum,
    note: z.string().optional(),
  }),

  smallWin: z.string().optional(),
});
