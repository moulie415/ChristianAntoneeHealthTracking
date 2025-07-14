import {z} from 'zod';

export const habitSchema = z.object({
  mobilityRoutine: z.enum(['Yes', 'No'], {
    required_error: 'Select Yes or No',
  }),
  mobilityNote: z.string().optional(),

  strengthRoutine: z.enum(['Yes', 'No'], {
    required_error: 'Select Yes or No',
  }),
  strengthNote: z.string().optional(),

  preBedRoutine: z.enum(['Yes', 'No'], {
    required_error: 'Select Yes or No',
  }),
  preBedNote: z.string().optional(),

  sleepingPosition: z.enum(['Yes', 'No', 'Didn’t need to'], {
    required_error: 'Select an option',
  }),
  sleepingNote: z.string().optional(),

  breathingPractice: z.enum(['Yes', 'No'], {
    required_error: 'Select Yes or No',
  }),
  breathingNote: z.string().optional(),

  aerobicExercise: z.enum(['Yes', 'No'], {
    required_error: 'Select Yes or No',
  }),
  aerobicNote: z.string().optional(),
});
