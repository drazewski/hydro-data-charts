import { useMemo } from "react";
import { useQuery } from "react-query";
import { getMonthlyRecords } from "../services/recordService";
import {
  AvailableDataType,
  MonthlyRecordType,
  MonthlyStructuredRecordType,
  RecordDataType,
} from "../types/recordTypes";

const initialAvailableData = {
  years: [],
  dataType: [],
};

export const useMonthlyRecords = (stationId: number, isMonthlyData: boolean, yearFrom?: number, yearTo?: number) => {
  const { data, isLoading } = useQuery(
    ["monthlyRecords", stationId, yearFrom, yearTo],
    (): Promise<MonthlyRecordType[]> => getMonthlyRecords(stationId, yearFrom, yearTo),
    { enabled: !!stationId && isMonthlyData }
  );

  const availableData =
    data?.reduce(
      (acc: AvailableDataType, curr: MonthlyRecordType) => {
        if (!acc.years.includes(curr.year)) {
          acc.years.push(curr.year);
        }

        if (!acc.dataType.includes(RecordDataType.flow) && curr.flow !== null && curr.flow !== undefined) {
          acc.dataType.push(RecordDataType.flow);
        }

        if (!acc.dataType.includes(RecordDataType.level) && curr.level !== null && curr.level !== undefined) {
          acc.dataType.push(RecordDataType.level);
        }

        if (
          !acc.dataType.includes(RecordDataType.temperature) &&
          curr.temperature !== null &&
          curr.temperature !== undefined
        ) {
          acc.dataType.push(RecordDataType.temperature);
        }

        return acc;
      },
      {
        years: [],
        dataType: [],
      }
    ) || initialAvailableData;

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (a.year === b.year) {
        return a.month - b.month;
      }
      return a.year - b.year;
    });
  }, [data]);

  const structuredData = useMemo(() => {
    return sortedData.reduce(
      (acc: MonthlyStructuredRecordType[], curr: MonthlyRecordType) => {
        acc.push({
          station_id: stationId,
          year: curr.year,
          month: curr.month,
          minLevel: curr.type === 1 ? Math.round(curr.level) : undefined,
          avgLevel: curr.type === 2 ? Math.round(curr.level) : undefined,
          maxLevel: curr.type === 3 ? Math.round(curr.level) : undefined,
          minFlow: curr.type === 1 ? Math.round(curr.flow) : undefined,
          avgFlow: curr.type === 2 ? Math.round(curr.flow) : undefined,
          maxFlow: curr.type === 3 ? Math.round(curr.flow) : undefined,
          minTemperature: curr.type === 1 ? curr.temperature : undefined,
          avgTemperature: curr.type === 2 ? curr.temperature : undefined,
          maxTemperature: curr.type === 3 ? curr.temperature : undefined,
        });

        return acc;
      },
      []
    );
  }, [sortedData]);

  const mergedByMonth = useMemo(() => Object.values(
    structuredData.reduce(
      (acc: Record<string, MonthlyStructuredRecordType>, item) => {
        const key = `${item.year}-${item.month}`;
        if (!acc[key]) {
          acc[key] = {
            year: item.year,
            month: item.month,
            station_id: item.station_id,
          };
        }

        (["minLevel","avgLevel","maxLevel","minFlow","avgFlow","maxFlow","minTemperature","avgTemperature","maxTemperature"] as const).forEach((field) => {
          const value = item[field];
          if (value !== null && value !== undefined) {
            acc[key][field] = value;
          }
        });

        return acc;
      },
      {}
    )
  ), [sortedData]);

  return {
    data: mergedByMonth,
    availableData: {
      ...availableData,
      year: availableData.years.sort().reverse(),
    },
    isLoading,
  };
};
