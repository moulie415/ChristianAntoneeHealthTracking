import dayjs from 'dayjs';
import {collection, doc, getDoc, getDocs, orderBy, query, where} from 'firebase/firestore';
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

export interface FormEntry {
  dateKey: string;
  form: FormDataType;
  id: string;
  type: FormType;
  updatedAt: Date;
}

export const getDailyEntries = async (
  type: FormType | null,
  uid: string,
  timeSpan: TimeSpan = 'weekly',
) => {
  if (!type) {
    throw new Error('Invalid type')
  }
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
  const snapshot = await getDocs(q);

  return snapshot.docs;
};



export const getDailyEntry = async (
  type: FormType,
  uid: string,
  day: string
) => {
  const dailyEntryRef = doc(db, 'users', uid, 'dailyEntries', `${type}_${dayjs(day).format('YYYYMMDD')}`);
  const docSnap = await getDoc(dailyEntryRef);
  if (!docSnap.exists()) {
    throw Error("Couldn't find entry for that date")
  }
  return docSnap;
};
