
import apiClient from '../config/api';
import { MonthlyRecordType, YearlyRecordType } from '../types/recordTypes';

const baseUrl = 'records';

export const getMonthlyRecords = async (
  stationId: number,
  yearOrFrom?: number,
  toYear?: number
): Promise<MonthlyRecordType[]> => {
  let url = `${baseUrl}/monthly/${stationId}`;

  if (typeof yearOrFrom === "number" && typeof toYear === "number") {
    url += `?from=${yearOrFrom}&to=${toYear}`;
  } else if (typeof yearOrFrom === "number") {
    url += `/${yearOrFrom}`;
  }
  const { data } = await apiClient.get(url);
  return data;
};

export const getYearlyRecords = async (
  stationId: number,
  from?: number,
  to?: number,
): Promise<YearlyRecordType[]> => {
  let url = `${baseUrl}/yearly/${stationId}`;
  if (typeof from === "number" && typeof to === "number") {
    url += `?from=${from}&to=${to}`;
  }
  const { data } = await apiClient.get(url);
  return data;
};

export const getYearlyRecordsWithTemperature = async (): Promise<YearlyRecordType[]> => {
  const url = `${baseUrl}/yearly/withTemperature`;
  const { data } = await apiClient.get(url);
  return data;
}
// export const getSingleRecord = async (recordId: number): Promise<RecordData> => {
//   const { data } = await apiClient.get(`records/${recordId}`);
//   return data;
// };