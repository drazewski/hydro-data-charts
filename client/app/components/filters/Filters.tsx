import { Checkbox, ComboboxItem, Loader, Radio, Select, Switch, SwitchGroup } from "@mantine/core";
import { useMonthlyRecords } from "../../hooks/useMonthlyRecords";
import { useStationStore } from "../../hooks/useStationStore";
import { RecordDataType, StationType } from "../../types/recordTypes";
import styles from "./filters.module.css";
import { useMemo } from "react";
import { useYearlyRecords } from "../../hooks/useYearlyRecords";

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
  const { availableData: monthlyAvailableData, isLoading: isLoadingMonthly } = useMonthlyRecords(selectedStation?.id, isMonthlyData);
  const { availableData: yearlyAvailableData, isLoading: isLoadingYearly } = useYearlyRecords(selectedStation?.id, isMonthlyData);

  const sortedYears = useMemo(() => {
    const yrs = isMonthlyData ? monthlyAvailableData.years : yearlyAvailableData.years;
    return [...(yrs || [])].sort((a, b) => a - b);
  }, [monthlyAvailableData.years, yearlyAvailableData.years, isMonthlyData]);

  const yearsOptions = useMemo(
    () => sortedYears.map((y) => ({ label: y.toString(), value: y.toString() })),
    [sortedYears]
  );

   const yearsOptionsFrom = useMemo(() => {
    return yearsOptions;
  }, [yearsOptions]);

  const yearsOptionsTo = useMemo(() => {
    const from = yearFrom ? Number(yearFrom) : undefined;
    const filtered = from
      ? yearsOptions.filter((opt) => Number(opt.value) >= from)
      : yearsOptions;
    return filtered;
  }, [yearsOptions, yearFrom]);

const handleYearFromChange = (_: string | null, option: ComboboxItem) => {
    const newFrom = option?.value ?? null;
    if (!newFrom) return;

    if (yearTo && Number(yearTo) < Number(newFrom)) {
      setYearTo(newFrom);
    }
    setYearFrom(newFrom);
  };

  const handleYearToChange = (_: string | null, option: ComboboxItem) => {
    const newTo = option?.value ?? null;
    if (!newTo) return;

    if (!yearFrom) {
      setYearFrom(newTo);
    } else if (Number(newTo) < Number(yearFrom)) {
      setYearTo(yearFrom);
      return;
    }
    setYearTo(newTo);
  };
  const handleDataTypeChange = (newDataType: string) => {
    setSelectedDataType(newDataType as RecordDataType);
  }

  return (
    <div>
      {isLoadingMonthly || isLoadingYearly ? (
        <Loader color="blue" size="xl" type="bars" className={styles.loader} />
      ) : (
        <div className={styles.container}>
          <div className={styles.row}>
            <Select
              data={yearsOptionsFrom}
              label="Rok: od"
              placeholder="Wybierz"
              disabled={!sortedYears.length}
              classNames={{ option: styles.option, input: styles.option }}
              value={yearFrom ?? null}
              onChange={handleYearFromChange}
              withAsterisk
            />
            <Select
              data={yearsOptionsTo}
              label="Rok: do"
              placeholder="Wybierz"
              disabled={!sortedYears.length}
              classNames={{ option: styles.option, input: styles.option }}
              value={yearTo ?? null}
              onChange={handleYearToChange}
              withAsterisk
            />
            <div>
              <div>Dane roczne / miesięczne</div>
              <Switch
                label={isMonthlyData ? "Miesięczne" : "Roczne"}
                onChange={(event) => setMonthlyData(event.currentTarget.checked)}
                value="yearly"
                />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <Radio.Group
                name="dataType"
                label="Rodzaj danych"
                withAsterisk
                className={styles.group}
                value={dataType}
                onChange={handleDataTypeChange}
              >
                <Radio label="Stan wody (cm)" value={RecordDataType.level} />
                <Radio label="Przepływ (m3/s)" value={RecordDataType.flow} />
                <Radio label="Temperatura wody (°C)" value={RecordDataType.temperature} />
              </Radio.Group>
          
            </div>
            <div>
              <Checkbox.Group
                label={"Wartości"}
                value={aggregations}
                onChange={setAggregation}
                className={styles.group}
              >
                  <Checkbox value="max" label="Maksymalne" color="red"/>
                  <Checkbox value="avg" label="Średnie" color="blue"/>
                  <Checkbox value="min" label="Minimalne" color="black"/>
              </Checkbox.Group>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
