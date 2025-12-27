import stations from '../assets/data/stations.json';
import { StationType } from '../types/recordTypes';

interface UseStationsType {
  stations: StationType[];
}

export const useStations = (): UseStationsType => {
  const data = Array.isArray(stations.stations) ? stations.stations : [];

  const reducedStations = data.reduce((acc: StationType[], curr) => {
    if (typeof curr.waterName !== "string" || typeof curr.name !== "string") return acc;
    if (curr.waterName.includes('Jez.')) return acc;
    const waterName = curr.waterName.replace(/[0-9()]/g, "").trim();
    const stationName = curr.name.trim();
    const fullName = `${waterName} (${stationName})`;
    acc.push({
      id: curr.id,
      name: stationName,
      fullName,
      waterName,
    });
    return acc;
  }, []);

  return {
    stations: reducedStations.sort((a, b) => a.waterName.localeCompare(b.waterName)),
  }
}
