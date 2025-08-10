import {Card, CardContent} from '@/components/ui/card';
import dayjs from 'dayjs';
import {useNavigate} from 'react-router';
import type {FormEntry} from '../api';
import {Button} from './ui/button';

interface Props {
  entries: FormEntry[];
}

export default function DailyEntryList({entries}: Props) {
  const navigate = useNavigate();

  const getNavigationMapping = (entry: FormEntry) => {
    switch (entry.type) {
      case 'habit':
        return `/daily-habit-builder?date=${entry.dateKey}`;
      case 'pain':
        return `/pain-scale?date=${entry.dateKey}`;
      case 'sleep':
        return `/sleep-scale?date=${entry.dateKey}`;
      case 'stress':
        return `/stress-scale?date=${entry.dateKey}`;
    }
  };
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
              <Button onClick={() => navigate(getNavigationMapping(entry))}>
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
