import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {CheckCircle} from 'lucide-react';
import type {FormType} from '../api';

type SubmissionSuccessProps = {
  onEdit: () => void;
  type: FormType;
};

export function SubmissionSuccess({onEdit}: SubmissionSuccessProps) {
  return (
    <div className="px-4 sm:px-0">
      <Card className="max-w-xl mx-auto mt-12 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4">
          <CheckCircle className="text-green-500" size={48} />
          <h2 className="text-2xl font-bold">Thanks for checking in!</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your entry has been saved. Come back tomorrow to track again, or
            edit today’s entry if you need to make changes.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={onEdit} variant="outline">
              Edit Today’s Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
