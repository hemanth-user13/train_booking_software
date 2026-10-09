import type { Train } from '../features/trains/trainTypes'

const DAILY = [0, 1, 2, 3, 4, 5, 6]

/**
 * Demo timetable. These records live in code and are never written to storage,
 * so admin changes cannot accidentally destroy them.
 */
export const seedTrains: Train[] = [
  {
    id: 'seed-12951', number: '12951', name: 'Mumbai Rajdhani', from: 'MMCT', to: 'NDLS',
    departure: '17:00', arrival: '08:32', durationMinutes: 932, runsOn: DAILY,
    classes: ['3A', '2A', '1A'], fares: { '3A': 3010, '2A': 4185, '1A': 5180 },
    seats: { '3A': 64, '2A': 4, '1A': 0 }, origin: 'SEED',
  },
  {
    id: 'seed-12953', number: '12953', name: 'August Kranti Rajdhani', from: 'MMCT', to: 'NDLS',
    departure: '17:10', arrival: '10:55', durationMinutes: 1065, runsOn: DAILY,
    classes: ['3A', '2A', '1A'], fares: { '3A': 2870, '2A': 3990, '1A': 4955 },
    seats: { '3A': 48, '2A': 26, '1A': 10 }, origin: 'SEED',
  },
  {
    id: 'seed-12952', number: '12952', name: 'New Delhi Rajdhani', from: 'NDLS', to: 'MMCT',
    departure: '16:55', arrival: '08:35', durationMinutes: 940, runsOn: DAILY,
    classes: ['3A', '2A', '1A'], fares: { '3A': 3010, '2A': 4185, '1A': 5180 },
    seats: { '3A': 72, '2A': 30, '1A': 12 }, origin: 'SEED',
  },
  {
    id: 'seed-12301', number: '12301', name: 'Howrah Rajdhani', from: 'HWH', to: 'NDLS',
    departure: '16:50', arrival: '10:00', durationMinutes: 1030, runsOn: DAILY,
    classes: ['3A', '2A', '1A'], fares: { '3A': 2995, '2A': 4160, '1A': 5150 },
    seats: { '3A': 60, '2A': 24, '1A': 8 }, origin: 'SEED',
  },
  {
    id: 'seed-12381', number: '12381', name: 'Poorva Express', from: 'HWH', to: 'NDLS',
    departure: '08:00', arrival: '05:05', durationMinutes: 1265, runsOn: [3, 5, 6],
    classes: ['SL', '3A', '2A'], fares: { SL: 735, '3A': 1955, '2A': 2810 },
    seats: { SL: 140, '3A': 40, '2A': 0 }, origin: 'SEED',
  },
  {
    id: 'seed-12302', number: '12302', name: 'Howrah Rajdhani', from: 'NDLS', to: 'HWH',
    departure: '16:50', arrival: '09:55', durationMinutes: 1025, runsOn: DAILY,
    classes: ['3A', '2A', '1A'], fares: { '3A': 2995, '2A': 4160, '1A': 5150 },
    seats: { '3A': 56, '2A': 20, '1A': 6 }, origin: 'SEED',
  },
  {
    id: 'seed-12007', number: '12007', name: 'Mysuru Shatabdi', from: 'MAS', to: 'SBC',
    departure: '06:00', arrival: '11:00', durationMinutes: 300, runsOn: [0, 1, 2, 4, 5, 6],
    classes: ['CC', 'EC'], fares: { CC: 905, EC: 1810 },
    seats: { CC: 78, EC: 20 }, origin: 'SEED',
  },
  {
    id: 'seed-12639', number: '12639', name: 'Brindavan Express', from: 'MAS', to: 'SBC',
    departure: '07:40', arrival: '13:50', durationMinutes: 370, runsOn: DAILY,
    classes: ['SL', 'CC'], fares: { SL: 215, CC: 545 },
    seats: { SL: 90, CC: 2 }, origin: 'SEED',
  },
  {
    id: 'seed-12008', number: '12008', name: 'Chennai Shatabdi', from: 'SBC', to: 'MAS',
    departure: '17:00', arrival: '22:00', durationMinutes: 300, runsOn: [0, 1, 2, 4, 5, 6],
    classes: ['CC', 'EC'], fares: { CC: 905, EC: 1810 },
    seats: { CC: 70, EC: 18 }, origin: 'SEED',
  },
  {
    id: 'seed-12627', number: '12627', name: 'Karnataka Express', from: 'SBC', to: 'NDLS',
    departure: '19:20', arrival: '09:00', durationMinutes: 2260, runsOn: DAILY,
    classes: ['SL', '3A', '2A'], fares: { SL: 940, '3A': 2470, '2A': 3610 },
    seats: { SL: 160, '3A': 64, '2A': 22 }, origin: 'SEED',
  },
  {
    id: 'seed-12009', number: '12009', name: 'Ahmedabad Shatabdi', from: 'MMCT', to: 'ADI',
    departure: '06:20', arrival: '12:45', durationMinutes: 385, runsOn: [1, 2, 3, 4, 5, 6],
    classes: ['CC', 'EC'], fares: { CC: 1120, EC: 2140 },
    seats: { CC: 80, EC: 24 }, origin: 'SEED',
  },
  {
    id: 'seed-12010', number: '12010', name: 'Mumbai Shatabdi', from: 'ADI', to: 'MMCT',
    departure: '14:40', arrival: '21:20', durationMinutes: 400, runsOn: [1, 2, 3, 4, 5, 6],
    classes: ['CC', 'EC'], fares: { CC: 1120, EC: 2140 },
    seats: { CC: 76, EC: 22 }, origin: 'SEED',
  },
  {
    id: 'seed-12015', number: '12015', name: 'Ajmer Shatabdi', from: 'NDLS', to: 'JP',
    departure: '06:10', arrival: '10:40', durationMinutes: 270, runsOn: DAILY,
    classes: ['CC', 'EC'], fares: { CC: 860, EC: 1695 },
    seats: { CC: 90, EC: 30 }, origin: 'SEED',
  },
  {
    id: 'seed-12123', number: '12123', name: 'Deccan Queen', from: 'CSMT', to: 'PUNE',
    departure: '17:10', arrival: '20:25', durationMinutes: 195, runsOn: DAILY,
    classes: ['SL', 'CC'], fares: { SL: 140, CC: 420 },
    seats: { SL: 110, CC: 60 }, origin: 'SEED',
  },
  {
    id: 'seed-12124', number: '12124', name: 'Deccan Queen', from: 'PUNE', to: 'CSMT',
    departure: '07:15', arrival: '10:25', durationMinutes: 190, runsOn: DAILY,
    classes: ['SL', 'CC'], fares: { SL: 140, CC: 420 },
    seats: { SL: 110, CC: 60 }, origin: 'SEED',
  },
  {
    id: 'seed-12723', number: '12723', name: 'Telangana Express', from: 'SC', to: 'NDLS',
    departure: '06:00', arrival: '08:15', durationMinutes: 1575, runsOn: DAILY,
    classes: ['SL', '3A', '2A'], fares: { SL: 760, '3A': 1990, '2A': 2875 },
    seats: { SL: 150, '3A': 56, '2A': 18 }, origin: 'SEED',
  },
  {
    id: 'seed-12004', number: '12004', name: 'Lucknow Swarna Shatabdi', from: 'NDLS', to: 'LKO',
    departure: '06:10', arrival: '12:40', durationMinutes: 390, runsOn: DAILY,
    classes: ['CC', 'EC'], fares: { CC: 1245, EC: 2390 },
    seats: { CC: 84, EC: 26 }, origin: 'SEED',
  },
  {
    id: 'seed-12623', number: '12623', name: 'Chennai Trivandrum Mail', from: 'MAS', to: 'ERS',
    departure: '19:45', arrival: '07:20', durationMinutes: 695, runsOn: DAILY,
    classes: ['SL', '3A', '2A', '1A'], fares: { SL: 410, '3A': 1085, '2A': 1540, '1A': 2575 },
    seats: { SL: 120, '3A': 48, '2A': 20, '1A': 6 }, origin: 'SEED',
  },
]
