import type { PublicUser, User } from '../features/auth/authTypes'


export function findUserByCredentials(users: User[], email: string, password: string): User | undefined {
  const normalised = email.trim().toLowerCase()
  return users.find((user) => user.email === normalised && user.password === password)
}

export function isEmailTaken(users: User[], email: string): boolean {
  const normalised = email.trim().toLowerCase()
  return users.some((user) => user.email === normalised)
}

export function toPublicUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user
  return rest
}

export function homePathFor(user: Pick<User, 'role'>): string {
  return user.role === 'ADMIN' ? '/admin/trains' : '/customer/search'
}
