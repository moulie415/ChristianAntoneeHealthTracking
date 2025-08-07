import {Card, CardContent} from '@/components/ui/card';
import dayjs from 'dayjs';
import type {FormEntry} from '../api';
import {Button} from './ui/button';

interface Props {
  entries: FormEntry[];
  onViewHistorical: (entry: FormEntry) => void;
}

export default function DailyEntryList({entries, onViewHistorical}: Props) {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      {entries.map(entry => (
        <Card
          key={entry.id}
          className="max-w-xl mx-auto mt-6 hover:shadow-md transition-shadow">
          <CardContent className="px-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}{' '}
                  Check-in
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dayjs(entry.updatedAt).format('MMM D, YYYY')}
                </p>
              </div>
              <Button onClick={() => onViewHistorical(entry)}>View</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
