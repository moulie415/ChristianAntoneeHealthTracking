import {httpsCallable} from 'firebase/functions';
import {functions} from '../App';
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
