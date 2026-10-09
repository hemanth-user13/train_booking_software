import type { User } from '../features/auth/authTypes'

export const seedUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Station Admin',
    email: 'admin@railbook.test',
    password: 'Admin@123',
    phone: '9000000001',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-demo',
    name: 'Hemanth goud',
    email: 'bhemanthgoud7878@gmail.com',
    password: 'Customer@123',
    phone: '9876543210',
    role: 'CUSTOMER',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]
