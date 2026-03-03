'use client';
import { useMemo, useState } from 'react';
import { ActionIcon, Autocomplete, CloseButton, Tooltip } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconPencil, IconX } from '@tabler/icons-react';
import { useStations } from '../../hooks/useStations';
import { useStationStore } from '../../hooks/useStationStore';
import styles from './stationForm.module.css';

const StationForm = () => {
  const { stations } = useStations();
  const selectedStation = useStationStore((state) => state.station);
  const setSelectedStation = useStationStore((state) => state.setSelectedStation);
  const [value, setValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const stationsNames = useMemo(() => stations.map(station => ({ label: station.fullName || '', value: station.id.toString() })), [stations]);

  const handleChange = useDebouncedCallback((newValue: string) => {
    const newSelectedStation = stations.find(
      (station) =>
        station.id.toString() === newValue ||
        station.fullName?.toLowerCase() === newValue.toLowerCase()
    );
    if (newSelectedStation) {
      setSelectedStation(newSelectedStation);
      setIsEditing(false);
    }
  }, 300);

  const handleClear = () => {
    setValue('');
    setSelectedStation(null);
    setIsEditing(false);
  };

  if (selectedStation && !isEditing) {
    return (
      <div className={styles.actions}>
        <Tooltip label="Zmień stację" className={styles.editButton}>
          <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => setIsEditing(true)} className={styles.editButton}>
            <IconPencil size={22} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Wyczyść wybór">
          <ActionIcon variant="subtle" color="red" onClick={handleClear}>
            <IconX size={22} />
          </ActionIcon>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={styles.searchRow}>
      <Autocomplete
        data={stationsNames}
        placeholder="Wpisz nazwę rzeki, miejscowości lub numer stacji..."
        value={value}
        autoFocus={isEditing}
        onChange={(newValue) => {
          setValue(newValue);
          handleChange(newValue);
        }}
        rightSection={value ? <CloseButton onClick={handleClear} aria-label="Wyczyść" /> : null}
        rightSectionPointerEvents="all"
      />
    </div>
  );
};

export default StationForm;
