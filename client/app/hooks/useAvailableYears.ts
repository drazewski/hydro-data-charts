import { useQuery } from 'react-query';
import apiClient from '../config/api';

const fetchAvailableYears = async (stationId: number, type: string): Promise<number[]> => {
  const { data } = await apiClient.get<{ years: number[] }>(`/records/years/${stationId}`, {
    params: { type },
  });
  return data.years;
};

export const useAvailableYears = (stationId: number | undefined, type: string) => {
  const { data, isLoading, isError } = useQuery(
    ['availableYears', stationId, type],
    () => fetchAvailableYears(stationId!, type),
    { enabled: !!stationId }
  );

  return { years: data ?? [], isLoading, isError };
};
