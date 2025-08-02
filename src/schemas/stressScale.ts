import {z} from 'zod';

export const stressSchema = z.object({
  stressLevel: z.enum(['0', '2', '4', '6', '8', '10']),
  stressTriggers: z
    .array(z.string())
    .min(1, 'Please select at least one stress trigger'),
  stressLocation: z.array(z.string()),
  stressHelpers: z.array(z.string()),
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
