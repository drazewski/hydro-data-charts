import stations from '../assets/data/stations.json';
import { StationType } from '../types/recordTypes';

interface UseStationsType {
  stations: StationType[];
}

export const useStations = (): UseStationsType => {
  const data = stations.stations;

  const reducedStations = data?.reduce((acc: StationType[], curr) => {
    if (curr.waterName.includes('Jez.')) return acc;
    const waterName = curr.waterName.replace(/[0-9()]/g, "");
    const stationName = curr.name;
    const fullName = `${waterName}(${stationName})`;
    acc.push({
      id: curr.id,
      name: stationName,
      fullName,
      waterName,
    });
    return acc;
  }, []).sort();

  return {
    stations: reducedStations.sort((a, b) => a.waterName.localeCompare(b.waterName)),
  }
}

