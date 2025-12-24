import { useMemo } from "react";    
import { useQuery } from "react-query";
import { YearlyRecordType } from "../types/recordTypes";
import { getYearlyRecordsWithTemperature } from "../services/recordService";

export const useYearlyRecordsWithTemperature = () => {
  const { data, error, isLoading } = useQuery<YearlyRecordType[], Error>(
    ["yearlyRecordsWithTemperature"],
    () => getYearlyRecordsWithTemperature()
  );

  const records = useMemo(() => {
    if (!data) return [];
    return data.map((record) => ({
      ...record,
      minTemperature: record.minTemperature != null ? Number(record.minTemperature).toFixed(2) : null,
      avgTemperature: record.avgTemperature != null ? Number(record.avgTemperature).toFixed(2) : null,
      maxTemperature: record.maxTemperature != null ? Number(record.maxTemperature).toFixed(2) : null,
    }));
  }, [data]);

  return { records, error, isLoading };
};
