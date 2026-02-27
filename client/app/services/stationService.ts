import apiClient from '../config/api';
import { StationType } from '../types/recordTypes';

export const getAllStations = async (): Promise<StationType[]> => {
  const { data } = await apiClient.get(`stations`);
  return data;
};

// export const getSingleRecord = async (recordId: number): Promise<RecordData> => {
//   const { data } = await apiClient.get(`records/${recordId}`);
//   return data;
// };