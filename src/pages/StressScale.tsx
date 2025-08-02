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
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Section} from '../components/Section';
import {Card, CardContent, CardHeader} from '../components/ui/card';
import {Label} from '../components/ui/label';
import {Spinner} from '../components/ui/spinner';
import {useAuth} from '../context/AuthContext';
import useSubmitTrackingForm from '../hooks/useSubmitTrackingForm';
import {useUserDailyEntries} from '../hooks/useUserDailyEntries';
import {stressSchema} from '../schemas/stressScale';

const triggerOptions = [
  {label: 'Pain or flare-up', value: 'pain'},
  {label: 'Poor sleep', value: 'sleep'},
  {label: 'Work demands', value: 'work'},
  {label: 'Family pressures', value: 'family'},
  {label: 'Money or bills', value: 'money'},
  {label: 'Lack of time for myself', value: 'no_time'},
  {label: 'Movement limitations', value: 'movement'},
  {label: 'Feeling stuck / not making progress', value: 'stuck'},
] as const;

const stressLocationOptions = [
  {label: 'Neck and shoulders', value: 'neck'},
  {label: 'Lower back', value: 'lower_back'},
  {label: 'Jaw or face', value: 'jaw'},
  {label: 'Chest / heart racing', value: 'chest'},
  {label: 'Head (tension or foggy)', value: 'head'},
  {label: 'Stomach (gut upset, tightness)', value: 'stomach'},
  {label: 'Nowhere in particular', value: 'nowhere'},
] as const;

const stressHelperOptions = [
  {label: 'Breathing exercises', value: 'breathing'},
  {label: 'Gentle movement or walk', value: 'movement'},
  {label: 'Talking to someone', value: 'talking'},
  {label: 'Listening to music or reading', value: 'music'},
  {label: 'A short nap or rest', value: 'nap'},
  {label: 'Stretching or mobility routine', value: 'stretching'},
  {label: 'Herbal tea or supplement', value: 'tea'},
  {label: 'Turning off screens', value: 'screens_off'},
  {label: 'Nothing helped today', value: 'nothing_helped'},
] as const;

const stressLevelOptions = [
  {label: '😌 0 – None: Calm and in control', value: 0},
  {label: '🙂 2 – Mild: A little tense', value: 2},
  {label: '😐 4 – Moderate: Waves of stress', value: 4},
  {label: '😟 6 – High: Overwhelmed most of the day', value: 6},
  {label: '😣 8 – Very High: Constantly reactive', value: 8},
  {label: '😫 10 – Maxed Out: Exhausted or drained', value: 10},
] as const;

const painImpactOptions = [
  {label: 'Yes — made it worse', value: 'worse'},
  {label: 'A little — felt more tense', value: 'tense'},
  {label: 'Not sure', value: 'not_sure'},
  {label: 'No noticeable impact', value: 'no_impact'},
  {label: 'Helped distract me from pain', value: 'helped_distract'},
];

const reflectionFeelingOptions = [
  {label: '😌 More aware and calm', value: 'aware'},
  {label: '🙂 A bit better', value: 'better'},
  {label: '😐 No change', value: 'no_change'},
  {label: '😟 Still overwhelmed', value: 'overwhelmed'},
  {label: '😣 Feeling worse', value: 'worse'},
];

export type StressFormValues = z.infer<typeof stressSchema>;

function StressScale() {
  const user = useAuth();

  const {isLoading, todayEntry, hasTodayEntry, entries, historicEntries} =
    useUserDailyEntries('stress', user?.uid || '');

  const form = useForm<StressFormValues>({
    resolver: zodResolver(stressSchema),
    defaultValues: {
      stressLevel: undefined,
      stressTriggers: [],
      stressLocation: [],
      stressHelpers: [],
      otherTrigger: '',
      otherHelper: '',
      painImpact: undefined,
      reflectionFeeling: undefined,
    },
  });

  useEffect(() => {
    if (todayEntry?.form) {
      form.reset(todayEntry?.form);
    }
  }, [todayEntry?.form, form]);

  const {loading, submitForm} = useSubmitTrackingForm(
    'stress',
    user?.uid || '',
  );

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">Daily Stress Check-In</h2>
      <p className="mb-6 text-muted-foreground">
        Reflect on your stress levels today. Awareness is the first step to
        building habits that help you manage and reduce tension throughout the
        day.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          {/* 1. Stress Level */}
          <Card>
            <CardHeader>
              <FormLabel>1. How would you rate your stress today?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="stressLevel"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={val => field.onChange(Number(val))}
                        value={String(field.value)}
                        className="space-y-2">
                        {stressLevelOptions.map(({label, value}) => (
                          <FormItem
                            key={value}
                            className="flex items-center gap-3">
                            <RadioGroupItem value={String(value)} />
                            <Label>{label}</Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 2. Stress Triggers */}
          <Card>
            <CardHeader>
              <FormLabel>
                2. What were your top stress triggers today?
              </FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="stressTriggers"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2">
                      {triggerOptions.map(({label, value}) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="stressTriggers"
                          render={({field}) => (
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(value)}
                                  onCheckedChange={checked => {
                                    const newValue = checked
                                      ? [...field.value, value]
                                      : field.value.filter(v => v !== value);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name="otherTrigger"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Other:</FormLabel>
                            <FormControl>
                              <Input placeholder="Other trigger" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 3. Where in body */}
          <Card>
            <CardHeader>
              <FormLabel> 3. Where did you feel stress in your body?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="stressLocation"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2">
                      {stressLocationOptions.map(({label, value}) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="stressLocation"
                          render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(value)}
                                  onCheckedChange={checked => {
                                    const newValue = checked
                                      ? [...field.value, value]
                                      : field.value.filter(v => v !== value);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 4. What helped */}
          <Card>
            <CardHeader>
              <FormLabel>
                4. What helped you manage your stress today?
              </FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="stressHelpers"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2">
                      {stressHelperOptions.map(({label, value}) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="stressHelpers"
                          render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(value)}
                                  onCheckedChange={checked => {
                                    const newValue = checked
                                      ? [...field.value, value]
                                      : field.value.filter(v => v !== value);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name="otherHelper"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Other:</FormLabel>
                            <FormControl>
                              <Input placeholder="Other helper" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Section
            title="5. Did your stress affect your pain today?"
            name="painImpact"
            radioOptions={painImpactOptions}
            control={form.control}
          />

          <Section
            title="6. How do you feel now, after reflecting?"
            name="reflectionFeeling"
            radioOptions={reflectionFeelingOptions}
            control={form.control}
          />

          <div className="pt-4 flex justify-center">
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default StressScale;
