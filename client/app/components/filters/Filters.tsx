import { Checkbox, ComboboxItem, Loader, Select, Switch, Text } from "@mantine/core";
import { useStationStore } from "../../hooks/useStationStore";
import { RecordDataType, StationType } from "../../types/recordTypes";
import styles from "./filters.module.css";
import { useEffect, useMemo } from "react";
import { useAvailableYears } from "../../hooks/useAvailableYears";

const DATA_TYPE_OPTIONS = [
  { label: "Stan wody (cm)", value: RecordDataType.level },
  { label: "Przepływ (m3/s)", value: RecordDataType.flow },
  { label: "Temp. wody (°C)", value: RecordDataType.temperature },
];

interface Props {
  selectedStation: StationType;
}

const Filters = ({ selectedStation }: Props) => {
  const yearFrom = useStationStore((s) => s.yearFrom);
  const yearTo = useStationStore((s) => s.yearTo);
  const setYearFrom = useStationStore((s) => s.setYearFrom);
  const setYearTo = useStationStore((s) => s.setYearTo);
  const aggregations = useStationStore((state) => state.aggregation);
  const dataType = useStationStore((state) => state.dataType);
  const isMonthlyData = useStationStore((state) => state.isMonthlyData);
  const setMonthlyData = useStationStore((state) => state.setIsMonthlyData);
  const setSelectedDataType = useStationStore((state) => state.setSelectedDataType);
  const setAggregation = useStationStore((state) => state.setAggregation);
  const { years, isLoading, isError } = useAvailableYears(selectedStation?.id);

  const sortedYears = useMemo(() => [...years].sort((a, b) => a - b), [years]);

  useEffect(() => {
    if (!isLoading && sortedYears.length > 0) {
      setYearFrom(sortedYears[0].toString());
      setYearTo(sortedYears[sortedYears.length - 1].toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation.id, isLoading]);

  const yearsOptions = useMemo(
    () => sortedYears.map((y) => ({ label: y.toString(), value: y.toString() })),
    [sortedYears]
  );

  const yearsOptionsFrom = useMemo(() => yearsOptions, [yearsOptions]);

  const yearsOptionsTo = useMemo(() => {
    const from = yearFrom ? Number(yearFrom) : undefined;
    return from ? yearsOptions.filter((opt) => Number(opt.value) >= from) : yearsOptions;
  }, [yearsOptions, yearFrom]);

  const handleYearFromChange = (_: string | null, option: ComboboxItem) => {
    const newFrom = option?.value ?? null;
    if (!newFrom) return;
    if (yearTo && Number(yearTo) < Number(newFrom)) setYearTo(newFrom);
    setYearFrom(newFrom);
  };

  const handleYearToChange = (_: string | null, option: ComboboxItem) => {
    const newTo = option?.value ?? null;
    if (!newTo) return;
    if (!yearFrom) { setYearFrom(newTo); }
    else if (Number(newTo) < Number(yearFrom)) { setYearTo(yearFrom); return; }
    setYearTo(newTo);
  };

  return (
    <div>
      {isLoading ? (
        <Loader color="blue" size="xl" type="bars" className={styles.loader} />
      ) : isError ? (
        <Text c="red">Błąd ładowania danych. Spróbuj ponownie.</Text>
      ) : (
        <div className={styles.container}>
          <div className={styles.row}>
            <Text className={styles.rangeLabel}>Zakres danych:</Text>
            <Select
              data={DATA_TYPE_OPTIONS}
              value={dataType}
              onChange={(v) => v && setSelectedDataType(v as RecordDataType)}
              styles={{ input: { height: 25, minHeight: 25 } }}
              w={160}
            />
            <Select
              data={yearsOptionsFrom}
              placeholder="od"
              disabled={!sortedYears.length}
              classNames={{ option: styles.option, input: styles.option }}
              styles={{ input: { height: 25, minHeight: 25 } }}
              value={yearFrom ?? null}
              onChange={handleYearFromChange}
              w={82}
            />
            <Select
              data={yearsOptionsTo}
              placeholder="do"
              disabled={!sortedYears.length}
              classNames={{ option: styles.option, input: styles.option }}
              styles={{ input: { height: 25, minHeight: 25 } }}
              value={yearTo ?? null}
              onChange={handleYearToChange}
              w={82}
            />
            <Switch
              size="md"
              label={isMonthlyData ? "Wartości miesięczne" : "Wartości roczne"}
              styles={{ label: { fontSize: 14, whiteSpace: "nowrap" } }}
              onChange={(event) => setMonthlyData(event.currentTarget.checked)}
              value="yearly"
            />
          </div>
          <div className={styles.row}>
            <Checkbox.Group
              label={"Wartości:"}
              classNames={{ label: styles.rangeLabel }}
              value={aggregations}
              onChange={(value) => setAggregation(value as ("min" | "avg" | "max")[])}
              className={styles.inlineGroup}
            >
              <Checkbox value="max" label="Maksymalne" color="red"/>
              <Checkbox value="avg" label="Średnie" color="blue"/>
              <Checkbox value="min" label="Minimalne" color="black"/>
            </Checkbox.Group>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
