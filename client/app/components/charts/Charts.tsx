import { LineChart } from '@mantine/charts';
import { RecordDataType, StationType } from "../../types/recordTypes";
import { useMonthlyRecords } from "../../hooks/useMonthlyRecords";
import { useCallback, useMemo } from 'react';
import { useStationStore } from '../../hooks/useStationStore';
import { useYearlyRecords } from '../../hooks/useYearlyRecords';
import ChartTooltip from '../chartTooltip/ChartTooltip';

interface Props {
  selectedStation: StationType;
  selectedType: RecordDataType;
  selectedYearFrom: string;
  selectedYearTo: string;
}

const Charts = ({ selectedStation, selectedYearFrom, selectedYearTo, selectedType }: Props) => {
  const aggregation = useStationStore((state) => state.aggregation);
  const isMonthlyData = useStationStore((state) => state.isMonthlyData);
  const { data: monthlyData } = useMonthlyRecords(selectedStation?.id, isMonthlyData, Number(selectedYearFrom), Number(selectedYearTo));
  const { data: yearlyData } = useYearlyRecords(selectedStation?.id, isMonthlyData, Number(selectedYearFrom), Number(selectedYearTo));

  const data = useMemo(() => {
    if (!monthlyData || !yearlyData) return [];

    if (isMonthlyData) {
      return monthlyData.map((d: any) => ({
        ...d,
        label: `${String(d.month).padStart(2, '0')}.${d.year}`, // np. 01.2023
      }));
    } else {
      return yearlyData.map((d: any) => ({
        ...d,
        label: String(d.year), // np. 2023
      }));
    }
  }, [yearlyData, monthlyData, isMonthlyData]);

  const minLineData = `min${selectedType}`;
  const avgLineData = `avg${selectedType}`;
  const maxLineData = `max${selectedType}`;

  const createSeries = useCallback(() => {
    const series = [];
    if (aggregation.includes('min')) {
      series.push({ name: minLineData, label: 'minimalne wartości', color: 'black' });
    }
    if (aggregation.includes('avg')) {
      series.push({ name: avgLineData, label: 'średnie wartości', color: 'blue' });
    }
    if (aggregation.includes('max')) {
      series.push({ name: maxLineData, label: 'maksymalne wartości', color: 'red' });
    }
    return series;
  }, [aggregation, minLineData, avgLineData, maxLineData]);

  const getUnit = useCallback(() => {
    switch (selectedType) {
      case RecordDataType.flow:
        return 'm3/s';
      case RecordDataType.level:
        return 'cm';
      case RecordDataType.temperature:
        return '°C';
      default:
        return '';
    }
  }, [selectedType]);

  const maxTemperature = useMemo(() => {
    if (aggregation.includes('max')) {
      return 28;
    } else if (aggregation.includes('avg')) {
      return 18;
    } else {
      return 14;
    }
  }, [aggregation]);

  return (
    <div>
      <LineChart
        h={400}
        data={data}
        dataKey="label"
        series={createSeries()}
        curveType="monotone"
        tickLine="x"
        gridAxis="xy"
        withDots={false}
        strokeWidth={3}
        // styl osi X
        xAxisProps={{
          tick: {
            fill: '#222',          // ciemny kolor tekstu
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'Poppins, sans-serif',
          },
          axisLine: { stroke: '#ccc' }, // cienka szara linia osi
        }}
        // styl osi Y
        yAxisProps={{
          domain: selectedType === RecordDataType.temperature ? [0, maxTemperature] : ['auto', 'auto'],
          tick: {
            fill: '#444',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'Poppins, sans-serif',
          },
          tickFormatter: (v) => `${v} ${getUnit()}`,
          axisLine: { stroke: '#ccc' },
        }}
        // siatka
        gridProps={{
          stroke: '#e0e0e0',    // kolor linii siatki
          strokeDasharray: '3 3', // przerywane linie
        }}
        // legenda
        legendProps={{
          verticalAlign: 'bottom',
          height: 50,
          wrapperStyle: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: 18,
            color: '#333',
          },
        }}
        valueFormatter={(value) => `${value} ${getUnit()}`}
        tooltipProps={{
          content: ({label, payload}) => <ChartTooltip label={label} payload={payload} unit={getUnit()} />,
          position: { y: 90 }
        }}
      />
    </div>
  );
}
export default Charts;