import type { Station } from '../types/common'

export const seedStations: Station[] = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi' },
]

export function getStation(code: string): Station | undefined {
  return seedStations.find((station) => station.code === code)
}

export function stationName(code: string): string {
  return getStation(code)?.name ?? code
}
