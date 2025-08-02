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
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Card, CardContent, CardHeader} from '../components/ui/card';
import {Label} from '../components/ui/label';
import {Spinner} from '../components/ui/spinner';
import {useAuth} from '../context/AuthContext';
import useSubmitTrackingForm from '../hooks/useSubmitTrackingForm';
import {useUserDailyEntries} from '../hooks/useUserDailyEntries';
import {stressSchema} from '../schemas/stressScale';

const triggerOptions = [
  'Pain or flare-up',
  'Poor sleep',
  'Work demands',
  'Family pressures',
  'Money or bills',
  'Lack of time for myself',
  'Movement limitations',
  'Feeling stuck / not making progress',
];

const stressLocationOptions = [
  'Neck and shoulders',
  'Lower back',
  'Jaw or face',
  'Chest / heart racing',
  'Head (tension or foggy)',
  'Stomach (gut upset, tightness)',
  'Nowhere in particular',
];

const stressHelperOptions = [
  'Breathing exercises',
  'Gentle movement or walk',
  'Talking to someone',
  'Listening to music or reading',
  'A short nap or rest',
  'Stretching or mobility routine',
  'Herbal tea or supplement',
  'Turning off screens',
  'Nothing helped today',
];

export type StressFormValues = z.infer<typeof stressSchema>;

function StressScale() {
  const user = useAuth();

  const {isLoading, todayEntry, hasTodayEntry, entries, historicEntries} =
    useUserDailyEntries('stress', user?.uid || '');

  console.log(entries);

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

  const {loading, submitForm} = useSubmitTrackingForm(
    'stress',
    user?.uid || '',
  );

  if (loading) {
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2">
                        <FormItem key="0" className="flex items-center gap-3">
                          <RadioGroupItem value="0" />
                          <Label htmlFor="0">
                            😌 0 – None: Calm and in control
                          </Label>
                        </FormItem>
                        <FormItem key="2" className="flex items-center gap-3">
                          <RadioGroupItem value="2" />
                          <Label htmlFor="2">🙂 2 – Mild: A little tense</Label>
                        </FormItem>
                        <FormItem key="4" className="flex items-center gap-3">
                          <RadioGroupItem value="4" />
                          <Label htmlFor="4">
                            😐 4 – Moderate: Waves of stress
                          </Label>
                        </FormItem>
                        <FormItem key="6" className="flex items-center gap-3">
                          <RadioGroupItem value="6" />
                          <Label htmlFor="6">
                            😟 6 – High: Overwhelmed most of the day
                          </Label>
                        </FormItem>
                        <FormItem key="8" className="flex items-center gap-3">
                          <RadioGroupItem value="8" />
                          <Label htmlFor="8">
                            😣 8 – Very High: Constantly reactive
                          </Label>
                        </FormItem>
                        <FormItem key="10" className="flex items-center gap-3">
                          <RadioGroupItem value="10" />
                          <Label htmlFor="10">
                            😫 10 – Maxed Out: Exhausted or drained
                          </Label>
                        </FormItem>
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
                      {triggerOptions.map(option => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="stressTriggers"
                          render={({field}) => (
                            <FormItem
                              key={option}
                              className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([...field.value, option])
                                      : field.onChange(
                                          field.value.filter(
                                            val => val !== option,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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
                      {stressLocationOptions.map(option => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="stressLocation"
                          render={({field}) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={checked =>
                                    checked
                                      ? field.onChange([...field.value, option])
                                      : field.onChange(
                                          field.value.filter(
                                            val => val !== option,
                                          ),
                                        )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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
                      {stressHelperOptions.map(option => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="stressHelpers"
                          render={({field}) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={checked =>
                                    checked
                                      ? field.onChange([...field.value, option])
                                      : field.onChange(
                                          field.value.filter(
                                            val => val !== option,
                                          ),
                                        )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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

          {/* 5. Did stress affect pain */}
          <Card>
            <CardHeader>
              <FormLabel> 5. Did your stress affect your pain today?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="painImpact"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2">
                        <FormItem
                          key="worse"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="worse" />
                          <Label htmlFor="worse"> Yes — made it worse</Label>
                        </FormItem>
                        <FormItem
                          key="tense"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="tense" />
                          <Label htmlFor="tense">
                            A little — felt more tense
                          </Label>
                        </FormItem>
                        <FormItem
                          key="not_sure"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="not_sure" />
                          <Label htmlFor="not_sure"> Not sure</Label>
                        </FormItem>
                        <FormItem
                          key="no_impact"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="no_impact" />
                          <Label htmlFor="no_impact">
                            No noticeable impact
                          </Label>
                        </FormItem>
                        <FormItem
                          key="helped_distract"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="helped_distract" />
                          <Label htmlFor="helped_distract">
                            Helped distract me from pain
                          </Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 6. Final Reflection */}
          <Card>
            <CardHeader>
              <FormLabel> 6. How do you feel now, after reflecting?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="reflectionFeeling"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2">
                        <FormItem
                          key="aware"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="aware" />
                          <Label htmlFor="aware">😌 More aware and calm</Label>
                        </FormItem>
                        <FormItem
                          key="better"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="better" />
                          <Label htmlFor="better"> 🙂 A bit better</Label>
                        </FormItem>
                        <FormItem
                          key="no_change"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="no_change" />
                          <Label htmlFor="no_change"> 😐 No change</Label>
                        </FormItem>
                        <FormItem
                          key="overwhelmed"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="overwhelmed" />
                          <Label htmlFor="overwhelmed">
                            😟 Still overwhelmed
                          </Label>
                        </FormItem>
                        <FormItem key="" className="flex items-center gap-3">
                          <RadioGroupItem value="worse" /> 😣 Feeling worse
                          <Label htmlFor=""></Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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
