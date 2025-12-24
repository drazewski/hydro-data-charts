
import apiClient from '../config/api';

export const getAllStations = async (): Promise<any[]> => {
  const { data } = await apiClient.get(`stations`);
  return data;
};

// export const getSingleRecord = async (recordId: number): Promise<RecordData> => {
//   const { data } = await apiClient.get(`records/${recordId}`);
//   return data;
// };