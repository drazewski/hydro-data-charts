'use client';
import { useMemo } from 'react';
import { Autocomplete} from '@mantine/core';
import { useStations } from '../../hooks/useStations';
import { useStationStore } from '../../hooks/useStationStore';
import styles from "./stationForm.module.css";

const StationForm = () => {
  const { stations } = useStations();
  const setSelectedStation = useStationStore((state) => state.setSelectedStation);

  const stationsNames = useMemo(() => stations.map(station => ({label: station.fullName || '', value: station.id.toString()})), [stations]);

  const handleChange = (value: string) => {
    const newSelectedStation = stations.find(
      (station) =>
        station.id.toString() === value ||
        station.fullName?.toLowerCase() === value.toLowerCase()
    );
    setSelectedStation(newSelectedStation || null);
  };

  return (
    <div>
      <Autocomplete
        data={stationsNames}
        placeholder="Wybierz rzekę"
        classNames={{
          option: styles.option,
          input: styles.option,
        }}
        onChange={handleChange}
      />
    </div>
  );
}

export default StationForm;
