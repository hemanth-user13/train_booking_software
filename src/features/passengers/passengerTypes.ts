import type { BerthPreference, Gender } from '../../types/common'

export interface PassengerDetails {
  name: string
  age: number
  gender: Gender
  berth: BerthPreference
}

export interface Passenger extends PassengerDetails {
  id: string
  userId: string
}

export interface PassengersState {
  items: Passenger[]
}
