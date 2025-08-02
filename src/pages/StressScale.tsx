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
