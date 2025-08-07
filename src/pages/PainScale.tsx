import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import type {FormEntry} from '../api';
import DailyEntryList from '../components/FormHistory';
import {SubmissionSuccess} from '../components/SubmissionSuccess';
import {Button} from '../components/ui/button';
import {Checkbox} from '../components/ui/checkbox';
import {Input} from '../components/ui/input';
import {Label} from '../components/ui/label';
import {RadioGroup, RadioGroupItem} from '../components/ui/radio-group';
import {Slider} from '../components/ui/slider';
import {Spinner} from '../components/ui/spinner';
import {Textarea} from '../components/ui/textarea';
import {useAuth} from '../context/AuthContext';
import useSubmitTrackingForm from '../hooks/useSubmitTrackingForm';
import {useUserDailyEntries} from '../hooks/useUserDailyEntries';
import {
  MoodEnum,
  PainLocationEnum,
  painScaleSchema,
  PainTypeEnum,
  RelieveEnum,
  WorsenEnum,
} from '../schemas/painScale';

type Option<T extends string> = {label: string; value: T};

const painLocationOptions: Option<z.infer<typeof PainLocationEnum>>[] = [
  {label: 'Lower back (centered)', value: 'lower_back_centered'},
  {label: 'One side of lower back', value: 'lower_back_one_side'},
  {label: 'Glute/buttock area', value: 'glute_area'},
  {label: 'Hamstring/back of thigh', value: 'hamstring'},
  {label: 'Calf or foot', value: 'calf_or_foot'},
  {label: 'Numbness / tingling', value: 'numbness_or_tingling'},
];

const painTypeOptions: Option<z.infer<typeof PainTypeEnum>>[] = [
  {label: 'Sharp or stabbing', value: 'sharp_stabbing'},
  {label: 'Dull or aching', value: 'dull_aching'},
  {label: 'Burning', value: 'burning'},
  {label: 'Tingling or numbness', value: 'tingling_or_numbness'},
  {label: 'Radiating down leg', value: 'radiating_down_leg'},
];

const worsenOptions: Option<z.infer<typeof WorsenEnum>>[] = [
  {label: 'Sitting too long', value: 'sitting_too_long'},
  {label: 'Poor sleep', value: 'poor_sleep'},
  {label: 'Lifting/bending', value: 'lifting_bending'},
  {label: 'Stress/anxiety', value: 'stress_anxiety'},
  {label: 'Movement or exercise', value: 'movement_or_exercise'},
  {label: 'Nothing specific / unknown', value: 'nothing_specific'},
  {label: 'Other', value: 'other'},
];

const relieveOptions: Option<z.infer<typeof RelieveEnum>>[] = [
  {label: 'Gentle movement', value: 'gentle_movement'},
  {label: 'Walking', value: 'walking'},
  {label: 'Stretching', value: 'stretching'},
  {label: 'Breathing / relaxing', value: 'breathing_relaxing'},
  {label: 'Heat / cold therapy', value: 'heat_cold_therapy'},
  {label: 'Medication', value: 'medication'},
  {label: 'Other', value: 'other'},
];

const moodOptions: Option<z.infer<typeof MoodEnum>>[] = [
  {label: '😄 Hopeful', value: 'hopeful'},
  {label: '🙂 Accepting', value: 'accepting'},
  {label: '😐 Frustrated', value: 'frustrated'},
  {label: '😟 Anxious', value: 'anxious'},
  {label: '😢 Helpless', value: 'helpless'},
];

export const allPainOptions = [
  ...moodOptions,
  ...relieveOptions,
  ...worsenOptions,
  ...painTypeOptions,
  ...painLocationOptions,
];

export type PainScaleValues = z.infer<typeof painScaleSchema>;

function PainScale() {
  const user = useAuth();

  const {isLoading, todayEntry, hasTodayEntry, historicEntries} =
    useUserDailyEntries('pain', user?.uid || '');

  const [editToday, setEditToday] = useState(false);

  const [historical, setHistorical] = useState<FormEntry>();

  const onViewHistorical = (entry: FormEntry) => {
    setHistorical(entry);
    form.reset(entry.form as PainScaleValues);
  };

  const form = useForm<PainScaleValues>({
    resolver: zodResolver(painScaleSchema),
    defaultValues: {
      emotionalState: {
        note: '',
      },
      painLocations: [],
      painIntensity: 0,
      painTypes: [],
      painWorsenedBy: {reasons: [], otherReason: ''},
      painRelievedBy: {methods: [], otherMethod: ''},
      smallWin: '',
    },
  });

  useEffect(() => {
    if (todayEntry?.form) {
      form.reset(todayEntry?.form as PainScaleValues);
    }
  }, [todayEntry?.form, form]);

  const {watch, handleSubmit, control} = form;
  const painWorsenedBy = watch('painWorsenedBy');
  const painRelievedBy = watch('painRelievedBy');

  const painIntensity = watch('painIntensity');

  const {loading, submitForm} = useSubmitTrackingForm('pain', user?.uid || '');

  const onSubmit = (values: PainScaleValues) => {
    submitForm(values);
    setEditToday(false);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (hasTodayEntry && !editToday && !historical) {
    return (
      <>
        <SubmissionSuccess type="pain" onEdit={() => setEditToday(true)} />
        <DailyEntryList
          entries={historicEntries}
          onViewHistorical={onViewHistorical}
        />
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-2">Daily Pain Check-In</h2>
        {!!historical && (
          <h2 className="text-2xl font-bold mb-2">
            {dayjs(historical.updatedAt).format('MMM D, YYYY')}
          </h2>
        )}
      </div>
      <p className="mb-6 text-muted-foreground">
        Check off the habits you complete each day. It’s not about being perfect
        — it’s about building momentum and noticing what helps your body feel
        better.
      </p>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/** Question 1 */}
          <Card>
            <CardHeader>
              <FormLabel>1. Where are you feeling pain right now?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="painLocations"
                render={({field}) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      {painLocationOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center space-x-2">
                          <Checkbox
                            disabled={!!historical}
                            checked={field.value?.includes(opt.value)}
                            onCheckedChange={checked => {
                              const newVal = checked
                                ? [...field.value, opt.value]
                                : field.value.filter(v => v !== opt.value);
                              field.onChange(newVal);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 2 */}
          <Card>
            <CardHeader>
              <FormLabel>{`2. How intense is the pain right now? ${painIntensity}/10`}</FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="painIntensity"
                render={({field}) => (
                  <FormItem>
                    <Slider
                      disabled={!!historical}
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={val => field.onChange(val[0])}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 3 */}
          <Card>
            <CardHeader>
              <FormLabel>3. What kind of pain are you feeling?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="painTypes"
                render={({field}) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      {painTypeOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center space-x-2">
                          <Checkbox
                            disabled={!!historical}
                            checked={field.value?.includes(opt.value)}
                            onCheckedChange={checked => {
                              const newVal = checked
                                ? [...field.value, opt.value]
                                : field.value.filter(v => v !== opt.value);
                              field.onChange(newVal);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 4 */}
          <Card>
            <CardHeader>
              <FormLabel>4. What made it worse today?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="painWorsenedBy.reasons"
                render={({field}) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      {worsenOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center space-x-2">
                          <Checkbox
                            disabled={!!historical}
                            checked={field.value?.includes(opt.value)}
                            onCheckedChange={checked => {
                              const newVal = checked
                                ? [...field.value, opt.value]
                                : field.value.filter(v => v !== opt.value);
                              field.onChange(newVal);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {painWorsenedBy.reasons.includes('other') && (
                      <FormField
                        control={control}
                        name="painWorsenedBy.otherReason"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <Input
                              disabled={!!historical}
                              placeholder="Please specify..."
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 5 */}
          <Card>
            <CardHeader>
              <FormLabel>5. What helped reduce your pain today?</FormLabel>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="painRelievedBy.methods"
                render={({field}) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      {relieveOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center space-x-2">
                          <Checkbox
                            disabled={!!historical}
                            checked={field.value?.includes(opt.value)}
                            onCheckedChange={checked => {
                              const newVal = checked
                                ? [...field.value, opt.value]
                                : field.value.filter(v => v !== opt.value);
                              field.onChange(newVal);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {painRelievedBy.methods.includes('other') && (
                      <FormField
                        control={control}
                        name="painRelievedBy.otherMethod"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <Input
                              disabled={!!historical}
                              placeholder="Please specify..."
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 6 */}
          <Card>
            <CardHeader>
              <FormLabel>
                6. How do you feel emotionally about your pain today?
              </FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="emotionalState.mood"
                render={({field}) => (
                  <FormItem>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!historical}
                      className="flex flex-col space-y-1">
                      {moodOptions.map(opt => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-3">
                          <RadioGroupItem
                            key={opt.value}
                            value={opt.value}
                            id={opt.value}
                          />
                          <Label htmlFor={opt.value}>{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel className="mt-5 mb-2">
                Additional Note (optional)
              </FormLabel>
              <FormField
                control={control}
                name="emotionalState.note"
                render={({field}) => (
                  <FormItem>
                    <Textarea
                      disabled={!!historical}
                      placeholder="Add a note..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Question 7 */}
          <Card>
            <CardHeader>
              <FormLabel>
                7. One small win or progress today? (optional)
              </FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="smallWin"
                render={({field}) => (
                  <FormItem>
                    <Input
                      disabled={!!historical}
                      placeholder="I was able to..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="pt-4 flex justify-center">
            {editToday && (
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto mr-5"
                onClick={() => setEditToday(false)}>
                Back
              </Button>
            )}
            {!historical ? (
              <Button type="submit" className="w-full sm:w-auto">
                Submit
              </Button>
            ) : (
              <Button
                onClick={() => setHistorical(undefined)}
                type="button"
                className="w-full sm:w-auto">
                Back
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PainScale;
