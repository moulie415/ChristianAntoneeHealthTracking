import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getDailyEntry, type FormEntry, type FormType } from "../api";
import dayjs from "dayjs";


function isValidYYYYMMDD(str: string) {
  return dayjs(str, 'YYYYMMDD', true).isValid();
}

const useUserDailyEntry = (
    type: FormType,
    uid: string,
) => {
  const [searchParams] = useSearchParams();

  const date = searchParams.get('date')
  const  paramUid = searchParams.get('uid')


  const userId = paramUid || uid

  const normalizedDate = date
    ? dayjs(date).format('YYYYMMDD')
    : dayjs().format('YYYYMMDD');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dailyEntry', type, userId, normalizedDate],
    queryFn: () => getDailyEntry(type, userId, normalizedDate),
    staleTime: 1000 * 60 * 60 * 24,
    select: doc => {
      if (!doc.exists()) return undefined;
      const raw = doc.data();
      return {
        id: doc.id,
        ...raw,
        updatedAt: raw.updatedAt?.toDate?.() ?? new Date(),
      } as FormEntry;
    },
  });

  const isToday = !date || date === dayjs().format('YYYYMMDD')

  if (error) {
    throw error
  }


  if (date && !isValidYYYYMMDD(date)) {
    throw Error('Invalid date')
  }

  return {data, isLoading, error, refetch, isToday}
}

export default useUserDailyEntry