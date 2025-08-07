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
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import type {FormEntry} from '../api';
import DailyEntryList from '../components/FormHistory';
import {SubmissionSuccess} from '../components/SubmissionSuccess';
import {Spinner} from '../components/ui/spinner';
import {useAuth} from '../context/AuthContext';
import useSubmitTrackingForm from '../hooks/useSubmitTrackingForm';
import {useUserDailyEntries} from '../hooks/useUserDailyEntries';
import {habitSchema} from '../schemas/habitBuilder';

export type HabitFormValues = z.infer<typeof habitSchema>;

export function DailyHabitBuilder() {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      preBedNote: '',
      aerobicNote: '',
      mobilityNote: '',
      sleepingNote: '',
      strengthNote: '',
      breathingNote: '',
    },
  });

  const user = useAuth();

  const [editToday, setEditToday] = useState(false);
  const [historical, setHistorical] = useState<FormEntry>();

  const {loading, submitForm} = useSubmitTrackingForm('habit', user?.uid || '');

  const onViewHistorical = (entry: FormEntry) => {
    setHistorical(entry);
    form.reset(entry.form as HabitFormValues);
  };

  const {isLoading, todayEntry, hasTodayEntry, historicEntries} =
    useUserDailyEntries('habit', user?.uid || '');

  useEffect(() => {
    if (todayEntry?.form) {
      form.reset(todayEntry?.form as HabitFormValues);
    }
  }, [todayEntry?.form, form]);

  const onSubmit = (values: HabitFormValues) => {
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
        <SubmissionSuccess type="habit" onEdit={() => setEditToday(true)} />
        <DailyEntryList
          entries={historicEntries}
          onViewHistorical={onViewHistorical}
        />
      </>
    );
  }

  type Option = boolean | 'no_need_to';

  const booleanLabel = (val: boolean) => (val ? 'Yes' : 'No');

  const DailyHabitSection = ({
    title,
    name,
    noteName,
    options,
    notePlaceholder,
  }: {
    title: string;
    name: keyof HabitFormValues;
    noteName: keyof HabitFormValues;
    options: Option[];
    notePlaceholder: string;
  }) => (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={form.control}
          name={name}
          render={({field}) => {
            // Map form value (boolean|string) to string for RadioGroup defaultValue
            const stringValue = String(field.value);

            return (
              <FormItem>
                <FormLabel className="font-semibold">{title}</FormLabel>
                <FormControl>
                  <RadioGroup
                    disabled={!!historical}
                    onValueChange={val => {
                      // Convert string back to proper type
                      if (val === 'true') {
                        field.onChange(true);
                      } else if (val === 'false') {
                        field.onChange(false);
                      } else {
                        // for "no_need_to"
                        field.onChange(val);
                      }
                    }}
                    defaultValue={stringValue}
                    className="flex gap-4">
                    {options.map(opt => {
                      // label to show user
                      const label =
                        typeof opt === 'boolean'
                          ? booleanLabel(opt)
                          : opt === 'no_need_to'
                            ? "Didn't need to"
                            : opt;

                      return (
                        <FormItem
                          key={String(opt)}
                          className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={String(opt)} />
                          </FormControl>
                          <FormLabel className="font-normal">{label}</FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          disabled={!!historical}
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
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-2">
          Daily Habit Builder for Back Pain Recovery
        </h2>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DailyHabitSection
            title="🧘‍♂️ 1. Mobility Routine"
            name="mobilityRoutine"
            noteName="mobilityNote"
            options={[true, false]}
            notePlaceholder="Which movement helped the most?"
          />
          <DailyHabitSection
            title="💪 2. Strength Routine"
            name="strengthRoutine"
            noteName="strengthNote"
            options={[true, false]}
            notePlaceholder="How did your body feel afterward?"
          />
          <DailyHabitSection
            title="💤 3. Pre-Bed Routine"
            name="preBedRoutine"
            noteName="preBedNote"
            options={[true, false]}
            notePlaceholder="What did you include? (e.g. stretching, reading, dim lights)"
          />
          <DailyHabitSection
            title="🛏️ 4. Sleeping Position Exploration"
            name="sleepingPosition"
            noteName="sleepingNote"
            options={[true, false, 'no_need_to']}
            notePlaceholder="Which position helped (or didn’t)?"
          />
          <DailyHabitSection
            title="🌬️ 5. Slow, Deep Breathing"
            name="breathingPractice"
            noteName="breathingNote"
            options={[true, false]}
            notePlaceholder="When did you do it? For how long?"
          />
          <DailyHabitSection
            title="🚶‍♂️ 6. Aerobic Exercise (15-min +)"
            name="aerobicExercise"
            noteName="aerobicNote"
            options={[true, false]}
            notePlaceholder="How did it feel on your back?"
          />

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
