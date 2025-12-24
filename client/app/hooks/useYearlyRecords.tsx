// hooks/useYearlyRecords.ts
import { useMemo } from "react";    
import { useQuery } from "react-query";
import { YearlyRecordType, RecordDataType } from "../types/recordTypes";
import { getYearlyRecords } from "../services/recordService";

export const useYearlyRecords = (stationId: number, isMonthlyData: boolean, yearFrom?: number, yearTo?: number) => {
  const { data, isLoading } = useQuery(
    ["yearlyRecords", stationId, yearFrom, yearTo],
    (): Promise<YearlyRecordType[]> => getYearlyRecords(stationId, yearFrom, yearTo),
    { enabled: !!stationId && !isMonthlyData }
  );

  const sorted = useMemo(() => {
    return (data ?? []).slice().sort((a, b) => a.year - b.year);
  }, [data]);

  const availableYears = useMemo(() => sorted.map((r) => r.year), [sorted]);

  const hasType = (t: RecordDataType) => {
    switch (t) {
      case RecordDataType.level:
        return sorted.some((r) => r.minLevel != null || r.avgLevel != null || r.maxLevel != null);
      case RecordDataType.flow:
        return sorted.some((r) => r.minFlow != null || r.avgFlow != null || r.maxFlow != null);
      case RecordDataType.temperature:
        return sorted.some((r) => r.minTemperature != null || r.avgTemperature != null || r.maxTemperature != null);
      default:
        return false;
    }
  };

  return {
    data: sorted,
    availableData: { years: availableYears, hasType },
    isLoading,
  };
};
