import type { Role } from '../../types/common'

export interface User {
  id: string
  name: string
  email: string
  /** Plain text on purpose: this is a demo, localStorage is not a secure store. */
  password: string
  phone: string
  role: Role
  createdAt: string
}

/** The user object without the password, safe to hand to UI components. */
export type PublicUser = Omit<User, 'password'>

export interface AuthState {
  users: User[]
  currentUserId: string | null
}
