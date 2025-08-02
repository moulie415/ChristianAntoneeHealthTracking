import {z} from 'zod';

export const habitSchema = z.object({
  mobilityRoutine: z.boolean(),
  mobilityNote: z.string().optional(),

  strengthRoutine: z.boolean(),
  strengthNote: z.string().optional(),

  preBedRoutine: z.boolean(),
  preBedNote: z.string().optional(),

  sleepingPosition: z.union([z.boolean(), z.enum(['no_need_to'])]),
  sleepingNote: z.string().optional(),

  breathingPractice: z.boolean(),
  breathingNote: z.string().optional(),

  aerobicExercise: z.boolean(),
  aerobicNote: z.string().optional(),
});
