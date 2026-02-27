import { useQuery } from 'react-query';
import apiClient from '../config/api';

const fetchAvailableYears = async (stationId: number): Promise<number[]> => {
  const { data } = await apiClient.get<{ years: number[] }>(`/records/years/${stationId}`);
  return data.years;
};

export const useAvailableYears = (stationId: number | undefined) => {
  const { data, isLoading, isError } = useQuery(
    ['availableYears', stationId],
    () => fetchAvailableYears(stationId!),
    { enabled: !!stationId }
  );

  return { years: data ?? [], isLoading, isError };
};
