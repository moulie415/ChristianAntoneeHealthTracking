import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import type {FormType} from '../api';
import DailyEntryList from '../components/FormHistory';
import {SubmissionSuccess} from '../components/SubmissionSuccess';
import {Spinner} from '../components/ui/spinner';
import {useAuth} from '../context/AuthContext';
import {useUserDailyEntries} from '../hooks/useUserDailyEntries';

const FormHistory = () => {
  const user = useAuth();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');
  const success = searchParams.get('success');

  const {isLoading, historicEntries} = useUserDailyEntries(
    type as FormType | null,
    user?.uid || '',
  );

  useEffect(() => {
    const validTypes: FormType[] = ['habit', 'pain', 'sleep', 'stress'];
    if (!type) {
      throw Error('No valid history type specified');
    }
    if (!validTypes.includes(type as FormType)) {
      throw Error('Invalid history type');
    }
  }, [type, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <>
      {!!success && <SubmissionSuccess type={type as FormType} />}
      <DailyEntryList entries={historicEntries} />
    </>
  );
};

export default FormHistory;
