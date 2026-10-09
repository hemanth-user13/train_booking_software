export type Role = 'CUSTOMER' | 'ADMIN'

export type TravelClass = 'SL' | '3A' | '2A' | '1A' | 'CC' | 'EC'

export type Quota = 'GENERAL' | 'TATKAL' | 'LADIES'

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export type BerthPreference = 'NONE' | 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER'

export interface Station {
  code: string
  name: string
  city: string
}
