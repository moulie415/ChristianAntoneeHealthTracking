import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {getDailyEntries, type FormType, type TimeSpan} from '../api';

export const useUserDailyEntries = (
  type: FormType,
  uid: string,
  timeSpan: TimeSpan = 'weekly',
) => {
  const {
    data: entries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dailyEntries', type, uid, timeSpan],
    queryFn: () => getDailyEntries(type, uid, timeSpan),
    staleTime: 1000 * 60 * 60 * 24,
    select: docs =>
      docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any),
        updatedAt: doc.data().updatedAt.toDate?.() ?? new Date(),
      })),
  });

  const today = dayjs().startOf('day');

  const todayEntry = entries?.find(entry =>
    dayjs(
      entry.updatedAt.toDate ? entry.updatedAt.toDate() : entry.updatedAt,
    ).isSame(today, 'day'),
  );

  const historicEntries =
    entries?.filter(
      entry =>
        !dayjs(
          entry.updatedAt.toDate ? entry.updatedAt.toDate() : entry.updatedAt,
        ).isSame(today, 'day'),
    ) ?? [];

  const hasTodayEntry = !!todayEntry;

  return {
    isLoading,
    error,
    refetch,
    entries,
    todayEntry,
    hasTodayEntry,
    historicEntries,
  };
};
