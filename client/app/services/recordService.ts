
import apiClient from '../config/api';
import { MonthlyRecordType } from '../types/recordTypes';

const baseUrl = 'records';

export const getMonthlyRecords = async (
  stationId: number,
  yearOrFrom?: number,
  toYear?: number
): Promise<MonthlyRecordType[]> => {
  let url = `${baseUrl}/monthly/${stationId}`;

  if (typeof yearOrFrom === "number" && typeof toYear === "number") {
    // Nowy tryb: zakres lat
    url += `?from=${yearOrFrom}&to=${toYear}`;
  } else if (typeof yearOrFrom === "number") {
    // Stary tryb: pojedynczy rok
    url += `/${yearOrFrom}`;
  }
  const { data } = await apiClient.get(url);
  return data;
};

export const getYearlyRecords = async (
  stationId: number,
  from?: number,
  to?: number,
): Promise<any[]> => {
  let url = `${baseUrl}/yearly/${stationId}`;
  if (typeof from === "number" && typeof to === "number") {
    url += `?from=${from}&to=${to}`;
  }
  const { data } = await apiClient.get(url);
  return data;
};

export const getYearlyRecordsWithTemperature = async (): Promise<any[]> => {
  const url = `${baseUrl}/yearly/withTemperature`;
  const { data } = await apiClient.get(url);
  return data;
}
// export const getSingleRecord = async (recordId: number): Promise<RecordData> => {
//   const { data } = await apiClient.get(`records/${recordId}`);
//   return data;
// };