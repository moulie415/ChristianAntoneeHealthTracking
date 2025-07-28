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
import {sleepScaleSchema} from '../schemas/sleepScale';

export type SleepFormValues = z.infer<typeof sleepScaleSchema>;

function SleepScale() {
  const form = useForm<SleepFormValues>({
    resolver: zodResolver(sleepScaleSchema),
    defaultValues: {
      sleepQuality: undefined,
      disruptions: [],
      helpers: [],
    },
  });

  const disruptionOptions = [
    'Back or nerve pain',
    'Hip discomfort',
    'Couldn’t find a comfortable position',
    'Racing thoughts or stress',
    'Bathroom trips',
    'Noise or light in the room',
    'Other',
  ];

  const helperOptions = [
    'Side sleeping with pillow support',
    'Heat pad or warm bath before bed',
    'Sleeping pills',
    'Relaxing breathwork or meditation',
    'Avoided screens before bed',
    'Herbal tea or supplement',
    'White noise or blackout curtains',
    'Gentle stretching or mobility',
    'Other',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">Daily Sleep Check-In</h2>
      <p className="mb-6 text-muted-foreground">
        How did you sleep last night? Tracking your rest can reveal patterns
        that help improve your recovery and energy day-to-day.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(values => console.log(values))}
          className="space-y-6">
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        <div key="terrible" className="flex items-center gap-3">
                          <RadioGroupItem value="terrible" />
                          <Label htmlFor="terrible">
                            {'😩 Terrible: I barely slept at all.'}
                          </Label>
                        </div>
                        <div key="veryPoor" className="flex items-center gap-3">
                          <RadioGroupItem value="veryPoor" />
                          <Label htmlFor="veryPoor">
                            {
                              '😖 Very Poor: Constantly waking, pain was unbearable.'
                            }
                          </Label>
                        </div>
                        <div key="poor" className="flex items-center gap-3">
                          <RadioGroupItem value="poor" />
                          <Label htmlFor="poor">
                            {'😕 Poor: Broken sleep, couldn’t get comfortable.'}
                          </Label>
                        </div>
                        <div key="fair" className="flex items-center gap-3">
                          <RadioGroupItem value="fair" />
                          <Label htmlFor="fair">
                            {'😐 Fair: A few wake-ups, not terrible..'}
                          </Label>
                        </div>
                        <div key="good" className="flex items-center gap-3">
                          <RadioGroupItem value="good" />
                          <Label htmlFor="good">
                            {
                              '🙂 Good: Slept fairly well, some minor disturbances.'
                            }
                          </Label>
                        </div>
                        <div
                          key="excellent"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="excellent" />
                          <Label htmlFor="excellent">
                            {
                              '😴 Excellent: Deep, refreshing sleep with no issues'
                            }
                          </Label>
                        </div>
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
                    {disruptionOptions.map(option => (
                      <FormField
                        key={option}
                        control={form.control}
                        name="disruptions"
                        render={({field}) => {
                          return (
                            <FormItem
                              key={option}
                              className="flex flex-row items-start space-y-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          option,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
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
                          );
                        }}
                      />
                    ))}

                    {form.watch('disruptions')?.includes('Other') && (
                      <FormField
                        control={form.control}
                        name="otherDisruption"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <FormLabel>Other disruption</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe..." {...field} />
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
                    {helperOptions.map(option => (
                      <FormField
                        key={option}
                        control={form.control}
                        name="helpers"
                        render={({field}) => {
                          return (
                            <FormItem
                              key={option}
                              className="flex flex-row items-start space-y-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          option,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
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
                          );
                        }}
                      />
                    ))}

                    {form.watch('helpers')?.includes('Other') && (
                      <FormField
                        control={form.control}
                        name="otherHelper"
                        render={({field}) => (
                          <FormItem className="mt-2">
                            <FormLabel>Other helper</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe..." {...field} />
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1">
                        <div
                          key="energized"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="energized" />
                          <Label htmlFor="energized">{'😄 Energized'}</Label>
                        </div>
                        <div key="calm" className="flex items-center gap-3">
                          <RadioGroupItem value="calm" />
                          <Label htmlFor="calm">{'🙂 Calm'}</Label>
                        </div>
                        <div key="neutral" className="flex items-center gap-3">
                          <RadioGroupItem value="neutral" />
                          <Label htmlFor="neutral">{'😐 Meh / Neutral'}</Label>
                        </div>
                        <div key="groggy" className="flex items-center gap-3">
                          <RadioGroupItem value="groggy" />
                          <Label htmlFor="groggy">{'😟 Groggy'}</Label>
                        </div>
                        <div key="tired" className="flex items-center gap-3">
                          <RadioGroupItem value="tired" />
                          <Label htmlFor="tired">{'😣 Tired and sore'}</Label>
                        </div>
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        <div key="lt4" className="flex items-center gap-3">
                          <RadioGroupItem value="<4" />
                          <Label htmlFor="<4">{'Less than 4'}</Label>
                        </div>

                        <div key="4-6" className="flex items-center gap-3">
                          <RadioGroupItem value="4–6" />
                          <Label htmlFor="4–6">{'4–6'}</Label>
                        </div>

                        <div key="6-7" className="flex items-center gap-3">
                          <RadioGroupItem value="6–7" />
                          <Label htmlFor="6–7">{'6–7'}</Label>
                        </div>

                        <div key="7-8" className="flex items-center gap-3">
                          <RadioGroupItem value="7–8" />
                          <Label htmlFor="7–8">{'7–8'}</Label>
                        </div>

                        <div key="gt8" className="flex items-center gap-3">
                          <RadioGroupItem value=">8" />
                          <Label htmlFor=">8">{'More than 8'}</Label>
                        </div>
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        <div key="0" className="flex items-center gap-3">
                          <RadioGroupItem value="0" />
                          <Label htmlFor="0">{'None'}</Label>
                        </div>
                        <div key="1-2" className="flex items-center gap-3">
                          <RadioGroupItem value="1–2" />
                          <Label htmlFor="1–2">{'1–2 times'}</Label>
                        </div>
                        <div key="3-4" className="flex items-center gap-3">
                          <RadioGroupItem value="3–4" />
                          <Label htmlFor="3–4">{'3–4 times'}</Label>
                        </div>
                        <div key="gt4" className="flex items-center gap-3">
                          <RadioGroupItem value=">4" />
                          <Label htmlFor=">4">{'More than 4'}</Label>
                        </div>
                        <div
                          key="countless"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="countless" />
                          <Label htmlFor="countless">{'I lost count'}</Label>
                        </div>
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2">
                        <div key="calm" className="flex items-center gap-3">
                          <RadioGroupItem value="calm" />
                          <Label htmlFor="calm">{'Calm and relaxed'}</Label>
                        </div>
                        <div
                          key="slightlyStressed"
                          className="flex items-center gap-3">
                          <RadioGroupItem value="slightly_stressed" />
                          <Label htmlFor="slightlyStressed">
                            {'Slightly stressed'}
                          </Label>
                        </div>
                        <div key="anxious" className="flex items-center gap-3">
                          <RadioGroupItem value="anxious" />
                          <Label htmlFor="anxious">
                            {'Anxious or overwhelmed'}
                          </Label>
                        </div>
                        <div key="alert" className="flex items-center gap-3">
                          <RadioGroupItem value="alert" />
                          <Label htmlFor="alert">{'Alert / stimulated'}</Label>
                        </div>
                        <div key="unknown" className="flex items-center gap-3">
                          <RadioGroupItem value="unknown" />
                          <Label htmlFor="unknown">{'Can’t remember'}</Label>
                        </div>
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

export default SleepScale;
