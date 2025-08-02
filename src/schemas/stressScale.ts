import {z} from 'zod';

export const StressTriggerEnum = z.enum([
  'pain',
  'sleep',
  'work',
  'family',
  'money',
  'no_time',
  'movement',
  'stuck',
]);

export const StressLocationEnum = z.enum([
  'neck',
  'lower_back',
  'jaw',
  'chest',
  'head',
  'stomach',
  'nowhere',
]);

export const StressHelperEnum = z.enum([
  'breathing',
  'movement',
  'talking',
  'music',
  'nap',
  'stretching',
  'tea',
  'screens_off',
  'nothing_helped',
]);

export const stressSchema = z.object({
  stressLevel: z.number().min(0).max(10),
  stressTriggers: z.array(StressTriggerEnum),
  stressLocation: z.array(StressLocationEnum),
  stressHelpers: z.array(StressHelperEnum),
  otherTrigger: z.string().optional(),
  otherHelper: z.string().optional(),
  painImpact: z.enum([
    'worse',
    'tense',
    'not_sure',
    'no_impact',
    'helped_distract',
  ]),
  reflectionFeeling: z.enum([
    'aware',
    'better',
    'no_change',
    'overwhelmed',
    'worse',
  ]),
});
