import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {habitSchema} from '../schemas/habitBuilder';

type HabitFormValues = z.infer<typeof habitSchema>;

export function DailyHabitBuilder() {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      mobilityRoutine: 'No',
      strengthRoutine: 'No',
      preBedRoutine: 'No',
      sleepingPosition: 'No',
      breathingPractice: 'No',
      aerobicExercise: 'No',
    },
  });

  const onSubmit = (values: HabitFormValues) => {
    console.log('Submitted habit form:', values);
    // TODO: send to backend or Firebase
  };

  const Section = ({
    title,
    name,
    noteName,
    radioOptions,
    notePlaceholder,
  }: {
    title: string;
    name: keyof HabitFormValues;
    noteName: keyof HabitFormValues;
    radioOptions: string[];
    notePlaceholder: string;
  }) => (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={form.control}
          name={name as any}
          render={({field}) => (
            <FormItem>
              <FormLabel className="font-semibold">{title}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4">
                  {radioOptions.map(opt => (
                    <FormItem key={opt} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={opt} />
                      </FormControl>
                      <FormLabel className="font-normal">{opt}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={noteName as any}
          render={({field}) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-sm">
                Optional note
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={notePlaceholder}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">
        Daily Habit Builder for Back Pain Recovery
      </h2>
      <p className="mb-6 text-muted-foreground">
        Check off the habits you complete each day. It’s not about being perfect
        — it’s about building momentum and noticing what helps your body feel
        better.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Section
            title="🧘‍♂️ 1. Mobility Routine"
            name="mobilityRoutine"
            noteName="mobilityNote"
            radioOptions={['Yes', 'No']}
            notePlaceholder="Which movement helped the most?"
          />
          <Section
            title="💪 2. Strength Routine"
            name="strengthRoutine"
            noteName="strengthNote"
            radioOptions={['Yes', 'No']}
            notePlaceholder="How did your body feel afterward?"
          />
          <Section
            title="💤 3. Pre-Bed Routine"
            name="preBedRoutine"
            noteName="preBedNote"
            radioOptions={['Yes', 'No']}
            notePlaceholder="What did you include? (e.g. stretching, reading, dim lights)"
          />
          <Section
            title="🛏️ 4. Sleeping Position Exploration"
            name="sleepingPosition"
            noteName="sleepingNote"
            radioOptions={['Yes', 'No', 'Didn’t need to']}
            notePlaceholder="Which position helped (or didn’t)?"
          />
          <Section
            title="🌬️ 5. Slow, Deep Breathing"
            name="breathingPractice"
            noteName="breathingNote"
            radioOptions={['Yes', 'No']}
            notePlaceholder="When did you do it? For how long?"
          />
          <Section
            title="🚶‍♂️ 6. Aerobic Exercise (15-min +)"
            name="aerobicExercise"
            noteName="aerobicNote"
            radioOptions={['Yes', 'No']}
            notePlaceholder="How did it feel on your back?"
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
