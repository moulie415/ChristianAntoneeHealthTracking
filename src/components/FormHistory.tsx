import {Card, CardContent} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import dayjs from 'dayjs';
import type {FormEntry, FormType} from '../api';
import {allPainOptions} from '../pages/PainScale';
import {allSleepOptions} from '../pages/SleepScale';
import {allStressOptions} from '../pages/StressScale';

interface Props {
  entries: FormEntry[];
}

function camelToTitleCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

const getQuestionMapping = (question: string) => {
  return camelToTitleCase(question);
};

const getAnswerLabel = (
  answer: string,
  options: {value: string | boolean | number; label: string}[],
) => {
  const option = options.find(({value}) => answer === value);
  return option
    ? option.label
    : typeof answer === 'string'
      ? answer.charAt(0).toUpperCase() + answer.slice(1)
      : answer;
};

const getAnswerMapping = (
  answer: string | boolean | number,
  type: FormType,
) => {
  if (typeof answer === 'number') return answer;

  if (typeof answer === 'boolean') {
    return answer ? 'Yes' : 'No';
  }
  if (answer === 'no_need_to') {
    return 'No need to';
  }

  if (answer === '') {
    return 'None';
  }
  switch (type) {
    case 'pain':
      return getAnswerLabel(answer, allPainOptions);
    case 'stress':
      return getAnswerLabel(answer, allStressOptions);
    case 'sleep':
      return getAnswerLabel(answer, allSleepOptions);
    case 'habit':
      return getAnswerLabel(answer, []);
  }
};

const flattenValues = (input: unknown): string[] => {
  if (Array.isArray(input)) {
    return input.flatMap(flattenValues);
  }

  if (typeof input === 'object' && input !== null) {
    return Object.values(input).flatMap(flattenValues);
  }

  return typeof input === 'string' && input.trim() !== '' ? [input] : [];
};

export default function DailyEntryList({entries}: Props) {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      {entries.map(entry => (
        <Card
          key={entry.id}
          className="max-w-xl mx-auto mt-12 hover:shadow-md transition-shadow">
          <CardContent className="px-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}{' '}
                  Check-in
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dayjs(entry.updatedAt).format('MMM D, YYYY')}
                </p>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2">
              {Object.entries(entry.form).map(([question, answer]) => {
                const flatValues = flattenValues(answer);
                return (
                  <div key={question}>
                    <p className="text-sm font-medium text-foreground">
                      {getQuestionMapping(question)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flatValues.length > 0
                        ? flatValues
                            .map(value => getAnswerMapping(value, entry.type))
                            .join(', ')
                        : 'None'}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
