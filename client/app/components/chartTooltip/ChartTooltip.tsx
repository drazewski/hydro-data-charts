import { Paper, Text } from '@mantine/core';
import { RecordDataTypeLabel } from '../../types/recordTypes';

interface ChartTooltipProps {
  label: React.ReactNode;
  payload: Record<string, any>[] | undefined;
  unit?: string;
}

const ChartTooltip = ({ label, payload, unit }: ChartTooltipProps) => {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" bg="white" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>
        {label}
      </Text>
      {payload.map((item: any) => {
        const displayName = RecordDataTypeLabel[item.name as keyof typeof RecordDataTypeLabel] ?? item.name;
        return (
          <Text key={item.name} c={item.color} fz="sm" ta={"left"}>
            {displayName}: {item.value} {unit}
          </Text>
        );
      })}
    </Paper>
  );
}

export default ChartTooltip;
