import dayjs from 'dayjs';
import {collection, getDocs, orderBy, query, where} from 'firebase/firestore';
import {httpsCallable} from 'firebase/functions';
import {db, functions} from '../App';
import type {HabitFormValues} from '../pages/DailyHabitBuilder';
import type {PainScaleValues} from '../pages/PainScale';
import type {SleepFormValues} from '../pages/SleepScale';
import type {StressFormValues} from '../pages/StressScale';

export type FormType = 'pain' | 'sleep' | 'stress' | 'habit';

export type FormDataType =
  | HabitFormValues
  | PainScaleValues
  | SleepFormValues
  | StressFormValues;

export const submitTrackingForm = (type: FormType, form: FormDataType) => {
  return httpsCallable<{type: FormType; form: FormDataType}>(
    functions,
    'submitTrackingForm ',
  )({type, form});
};

export type TimeSpan = 'weekly' | 'monthly' | 'yearly';

export const getDailyEntries = async (
  type: FormType,
  uid: string,
  timeSpan: TimeSpan = 'weekly',
) => {
  let date = dayjs().subtract(1, 'week').toDate();

  if (timeSpan === 'weekly') {
    date = dayjs().subtract(1, 'month').toDate();
  }
  if (timeSpan === 'yearly') {
    date = dayjs().subtract(1, 'year').toDate();
  }
  const dailyEntriesRef = collection(db, 'users', uid, 'dailyEntries');

  const q = query(
    dailyEntriesRef,
    where('type', '==', type),
    where('updatedAt', '>=', date),
    orderBy('updatedAt', 'desc'),
  );
  console.log('test 1');
  const snapshot = await getDocs(q);
  console.log('test 2');

  return snapshot.docs;
};
