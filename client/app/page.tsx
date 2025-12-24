'use client';

import { QueryClient, QueryClientProvider } from "react-query";
import styles from "./page.module.css";
import Filters from "./components/filters/Filters";
import StationForm from "./components/stationForm/StationForm";
import { useStationStore } from "./hooks/useStationStore";
import Charts from "./components/charts/Charts";

const queryClient = new QueryClient();

export default function Home() {
  const selectedStation = useStationStore((state) => state.station);
  const selectedYearFrom = useStationStore((state) => state.yearFrom);
  const selectedYearTo = useStationStore((state) => state.yearTo);
  const selectedType = useStationStore((state) => state.dataType);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>{selectedStation ? selectedStation.waterName : 'Wybierz stację pomiarową'}</h2>
        </div>
        <StationForm />
        {selectedStation && <Filters selectedStation={selectedStation} />}
        {selectedStation && selectedYearFrom && selectedYearTo && selectedType && (
          <div className={styles.subtitleWrapper}>
            {selectedStation && (
            <div className={styles.subtitleWrapper}>
              <span>Stacja pomiarowa:</span>
              <span className={styles.name}>
                <strong>{`${selectedStation.waterName} - ${selectedStation.name.toLowerCase()} (${selectedStation.id})`}</strong>
              </span>
            </div>
          )}
            <Charts
              selectedStation={selectedStation} 
              selectedType={selectedType}
              selectedYearFrom={selectedYearFrom}
              selectedYearTo={selectedYearTo}
            />
          <p className={styles.footerText1}>Źródłem pochodzenia danych jest <strong><a href="https://imgw.pl/" target="_blank">Instytut Meteorologii i Gospodarki Wodnej – Państwowy Instytut Badawczy</a>  </strong></p>
          <p className={styles.footerText2}>Dane Instytutu Meteorologii i Gospodarki Wodnej – Państwowego Instytutu Badawczego zostały przetworzone</p>
          </div>
        )}
      </main>
    </QueryClientProvider>
  );
}
