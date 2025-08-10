import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {zodResolver} from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Card, CardContent, CardHeader} from '../components/ui/card';
import {Label} from '../components/ui/label';
import {Spinner} from '../components/ui/spinner';
import {useAuth} from '../context/AuthContext';
import useSubmitTrackingForm from '../hooks/useSubmitTrackingForm';
import useUserDailyEntry from '../hooks/useUserDailyEntry';
import {
  DisruptionEnum,
  HelperEnum,
  MentalStateEnum,
  SleepDurationEnum,
  SleepQualityEnum,
  sleepScaleSchema,
  WakeFeelingEnum,
  WakeFrequencyEnum,
} from '../schemas/sleepScale';

export type SleepFormValues = z.infer<typeof sleepScaleSchema>;

const disruptionOptions: {
  label: string;
  value: z.infer<typeof DisruptionEnum>;
}[] = [
  {label: 'Back or nerve pain', value: 'back_pain'},
  {label: 'Hip discomfort', value: 'hip_discomfort'},
  {
    label: 'Couldn’t find a comfortable position',
    value: 'uncomfortable_position',
  },
  {label: 'Racing thoughts or stress', value: 'racing_thoughts'},
  {label: 'Bathroom trips', value: 'bathroom_trips'},
  {label: 'Noise or light in the room', value: 'noise_or_light'},
  {label: 'Other', value: 'other'},
];

const helperOptions: {
  label: string;
  value: z.infer<typeof HelperEnum>;
}[] = [
  {label: 'Side sleeping with pillow support', value: 'side_sleeping'},
  {label: 'Heat pad or warm bath before bed', value: 'heat_pad'},
  {label: 'Sleeping pills', value: 'sleeping_pills'},
  {label: 'Relaxing breathwork or meditation', value: 'breathwork'},
  {label: 'Avoided screens before bed', value: 'no_screens'},
  {label: 'Herbal tea or supplement', value: 'herbal_tea'},
  {label: 'White noise or blackout curtains', value: 'white_noise'},
  {label: 'Gentle stretching or mobility', value: 'stretching'},
  {label: 'Other', value: 'other'},
];

const sleepQualityOptions: {
  label: string;
  value: z.infer<typeof SleepQualityEnum>;
}[] = [
  {
    value: 'terrible',
    label: '😩 Terrible: I barely slept at all.',
  },
  {
    value: 'very_poor',
    label: '😖 Very Poor: Constantly waking, pain was unbearable.',
  },
  {
    value: 'poor',
    label: '😕 Poor: Broken sleep, couldn’t get comfortable.',
  },
  {
    value: 'fair',
    label: '😐 Fair: A few wake-ups, not terrible..',
  },
  {
    value: 'good',
    label: '🙂 Good: Slept fairly well, some minor disturbances.',
  },
  {
    value: 'excellent',
    label: '😴 Excellent: Deep, refreshing sleep with no issues',
  },
];

const wakeFeelingOptions: {
  label: string;
  value: z.infer<typeof WakeFeelingEnum>;
}[] = [
  {
    value: 'energized',
    label: '😄 Energized',
  },
  {
    value: 'calm',
    label: '🙂 Calm',
  },
  {
    value: 'neutral',
    label: '😐 Meh / Neutral',
  },
  {
    value: 'groggy',
    label: '😟 Groggy',
  },
  {
    value: 'tired',
    label: '😣 Tired and sore',
  },
];

const sleepDurationOptions: {
  label: string;
  value: z.infer<typeof SleepDurationEnum>;
}[] = [
  {
    value: '<4',
    label: 'Less than 4',
  },
  {
    value: '4–6',
    label: '4–6',
  },
  {
    value: '6–7',
    label: '6–7',
  },
  {
    value: '7–8',
    label: '7–8',
  },
  {
    value: '>8',
    label: 'More than 8',
  },
];

const wakeFrequencyOptions: {
  label: string;
  value: z.infer<typeof WakeFrequencyEnum>;
}[] = [
  {
    value: '0',
    label: 'None',
  },
  {
    value: '1–2',
    label: '1–2 times',
  },
  {
    value: '3–4',
    label: '3–4 times',
  },
  {
    value: '>4',
    label: 'More than 4',
  },
  {
    value: 'countless',
    label: 'I lost count',
  },
];

const mentalStateOptions: {
  label: string;
  value: z.infer<typeof MentalStateEnum>;
}[] = [
  {
    value: 'calm',
    label: 'Calm and relaxed',
  },
  {
    value: 'slightly_stressed',
    label: 'Slightly stressed',
  },
  {
    value: 'anxious',
    label: 'Anxious or overwhelmed',
  },
  {
    value: 'alert',
    label: 'Alert / stimulated',
  },
  {
    value: 'unknown',
    label: 'Can’t remember',
  },
];

export const allSleepOptions = [
  ...helperOptions,
  ...disruptionOptions,
  ...sleepQualityOptions,
  ...wakeFeelingOptions,
  ...sleepDurationOptions,
  ...wakeFrequencyOptions,
  ...mentalStateOptions,
];

function SleepScale() {
  const user = useAuth();

  const {data, isLoading, isToday} = useUserDailyEntry(
    'sleep',
    user?.uid || '',
  );

  const form = useForm<SleepFormValues>({
    resolver: zodResolver(sleepScaleSchema),
    defaultValues: {
      sleepQuality: undefined,
      disruptions: [],
      helpers: [],
    },
  });

  useEffect(() => {
    if (data?.form) {
      form.reset(data?.form as SleepFormValues);
    }
  }, [data?.form, form]);

  const {loading, submitForm} = useSubmitTrackingForm('sleep', user?.uid || '');

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-2">Daily Sleep Check-In</h2>
        {!isToday && (
          <h2 className="text-2xl font-bold mb-2">
            {dayjs(data?.updatedAt).format('MMM D, YYYY')}
          </h2>
        )}
      </div>
      <p className="mb-6 text-muted-foreground">
        How did you sleep last night? Tracking your rest can reveal patterns
        that help improve your recovery and energy day-to-day.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          {/* Question 1 */}
          <Card>
            <CardHeader>
              <FormLabel>1. How well did you sleep last night?</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="sleepQuality"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        disabled={!isToday}
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        {sleepQualityOptions.map(({value, label}) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} />
                            <Label htmlFor={value}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 2 */}
          <Card>
            <CardHeader>
              <FormLabel>2. What disrupted your sleep?</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="disruptions"
                render={() => (
                  <FormItem>
                    {disruptionOptions.map(({label, value}) => (
                      <FormField
                        key={value}
                        control={form.control}
                        name="disruptions"
                        render={({field}) => {
                          return (
                            <FormItem
                              key={value}
                              className="flex flex-row items-start space-y-1">
                              <FormControl>
                                <Checkbox
                                  disabled={!isToday}
                                  checked={field.value?.includes(value)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            val => val !== value,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}

                    {form.watch('disruptions')?.includes('other') && (
                      <FormField
                        control={form.control}
                        name="otherDisruption"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <FormLabel>Other disruption</FormLabel>
                            <FormControl>
                              <Input
                                disabled={!isToday}
                                placeholder="Describe..."
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 3 */}
          <Card>
            <CardHeader>
              <FormLabel>3. What helped you sleep better?</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="helpers"
                render={() => (
                  <FormItem>
                    {helperOptions.map(({label, value}) => (
                      <FormField
                        key={value}
                        control={form.control}
                        name="helpers"
                        render={({field}) => {
                          return (
                            <FormItem
                              key={value}
                              className="flex flex-row items-start space-y-1">
                              <FormControl>
                                <Checkbox
                                  disabled={!isToday}
                                  checked={field.value?.includes(value)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            val => val !== value,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}

                    {form.watch('helpers')?.includes('other') && (
                      <FormField
                        control={form.control}
                        name="otherHelper"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <FormLabel>Other helper</FormLabel>
                            <FormControl>
                              <Input
                                disabled={!isToday}
                                placeholder="Describe..."
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 4 */}
          <Card>
            <CardHeader>
              <FormLabel>4. How did you feel on waking?</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="wakeFeeling"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        disabled={!isToday}
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1">
                        {wakeFeelingOptions.map(({value, label}) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} />
                            <Label htmlFor={value}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 5 */}
          <Card>
            <CardHeader>
              <FormLabel> 5. Roughly how many hours did you sleep?</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="sleepDuration"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        disabled={!isToday}
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        {sleepDurationOptions.map(({value, label}) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} />
                            <Label htmlFor={value}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 6 */}
          <Card>
            <CardHeader>
              <FormLabel>
                6. How often did you wake up during the night?
              </FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="wakeFrequency"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        disabled={!isToday}
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        {wakeFrequencyOptions.map(({value, label}) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} />
                            <Label htmlFor={value}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Question 7 */}
          <Card>
            <CardHeader>
              <FormLabel>
                7. How would you describe your mental state before bed?
              </FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="mentalState"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        disabled={!isToday}
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        {mentalStateOptions.map(({value, label}) => (
                          <div key={value} className="flex items-center gap-3">
                            <RadioGroupItem value={value} />
                            <Label htmlFor={value}>{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="pt-4 flex justify-center">
            <Button
              disabled={!isToday}
              type="submit"
              className="w-full sm:w-auto">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SleepScale;
