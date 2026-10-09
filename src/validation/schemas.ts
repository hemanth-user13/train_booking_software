import { z } from 'zod'
import { ALL_CLASSES } from '../config/constants'
import { isPastDate, timeToMinutes } from '../utils/dateUtils'

const personName = z
  .string()
  .trim()
  .min(2, 'Enter at least 2 characters')
  .max(40, 'Keep it under 40 characters')
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, 'Use letters, spaces, dots or hyphens only')

const phone = z
  .string()
  .trim()
  .regex(/^$|^[6-9]\d{9}$/, 'Enter a 10 digit Indian mobile number')

/* ---------- Auth ---------- */

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: personName,
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type SignupValues = z.infer<typeof signupSchema>

export const profileSchema = z.object({
  name: personName,
  phone,
})
export type ProfileValues = z.infer<typeof profileSchema>

/* ---------- Search ---------- */

export const searchSchema = z
  .object({
    from: z.string().min(1, 'Choose a departure station'),
    to: z.string().min(1, 'Choose a destination station'),
    date: z.string().min(1, 'Pick a journey date'),
  })
  .refine((values) => !values.from || values.from !== values.to, {
    message: 'Destination must be different from the source',
    path: ['to'],
  })
  .refine((values) => !values.date || !isPastDate(values.date), {
    message: 'Journey date cannot be in the past',
    path: ['date'],
  })
export type SearchValues = z.infer<typeof searchSchema>

/* ---------- Passengers ---------- */

export const passengerSchema = z.object({
  name: personName,
  age: z
    .number({ error: 'Enter the age' })
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be 120 or less'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { error: 'Select a gender' }),
  berth: z.enum(['NONE', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER']),
})
export type PassengerValues = z.infer<typeof passengerSchema>

/* ---------- Payment methods ---------- */

export const paymentMethodSchema = z
  .object({
    type: z.enum(['DEBIT_CARD', 'CREDIT_CARD', 'UPI']),
    holderName: z.string().trim(),
    cardNumber: z.string().trim(),
    expiry: z.string().trim(),
    upiId: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'UPI') {
      if (!/^[\w.-]{2,}@[A-Za-z]{2,}$/.test(values.upiId)) {
        ctx.addIssue({ code: 'custom', path: ['upiId'], message: 'Enter a UPI ID like name@okbank' })
      }
      return
    }

    if (values.holderName.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['holderName'], message: 'Enter the name printed on the card' })
    }
    if (!/^\d{16}$/.test(values.cardNumber.replace(/\s/g, ''))) {
      ctx.addIssue({ code: 'custom', path: ['cardNumber'], message: 'Enter a 16 digit demo card number' })
    }

    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(values.expiry)
    if (!match) {
      ctx.addIssue({ code: 'custom', path: ['expiry'], message: 'Use MM/YY format' })
      return
    }
    const now = new Date()
    const expiryMonth = Number(match[1])
    const expiryYear = 2000 + Number(match[2])
    const expired =
      expiryYear < now.getFullYear() || (expiryYear === now.getFullYear() && expiryMonth < now.getMonth() + 1)
    if (expired) ctx.addIssue({ code: 'custom', path: ['expiry'], message: 'This card has expired' })
  })
export type PaymentMethodValues = z.infer<typeof paymentMethodSchema>

/* ---------- Admin: trains ---------- */

const classConfig = z.object({
  enabled: z.boolean(),
  fare: z.string(),
  seats: z.string(),
})

export const trainSchema = z
  .object({
    number: z.string().trim().regex(/^\d{5}$/, 'Train number must be 5 digits'),
    name: z.string().trim().min(3, 'Enter the train name').max(50, 'Keep it under 50 characters'),
    from: z.string().min(1, 'Choose the source station'),
    to: z.string().min(1, 'Choose the destination station'),
    departure: z.string().min(1, 'Enter the departure time'),
    arrival: z.string().min(1, 'Enter the arrival time'),
    arrivalDay: z.string(),
    runsOn: z.array(z.string()).min(1, 'Pick at least one operating day'),
    classes: z.object({
      SL: classConfig,
      '3A': classConfig,
      '2A': classConfig,
      '1A': classConfig,
      CC: classConfig,
      EC: classConfig,
    }),
  })
  .superRefine((values, ctx) => {
    if (values.from && values.from === values.to) {
      ctx.addIssue({ code: 'custom', path: ['to'], message: 'Destination must differ from the source' })
    }

    if (values.departure && values.arrival) {
      const duration = timeToMinutes(values.arrival) + Number(values.arrivalDay) * 1440 - timeToMinutes(values.departure)
      if (duration < 30) {
        ctx.addIssue({
          code: 'custom',
          path: ['arrival'],
          message: 'Arrival must be at least 30 minutes after departure',
        })
      }
    }

    const enabled = ALL_CLASSES.filter((cls) => values.classes[cls].enabled)
    if (enabled.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['classes'], message: 'Select at least one class' })
    }
    for (const cls of enabled) {
      const fare = Number(values.classes[cls].fare)
      const seats = Number(values.classes[cls].seats)
      if (!values.classes[cls].fare || !Number.isInteger(fare) || fare < 50 || fare > 20000) {
        ctx.addIssue({ code: 'custom', path: ['classes', cls, 'fare'], message: '50 to 20000' })
      }
      if (values.classes[cls].seats === '' || !Number.isInteger(seats) || seats < 0 || seats > 1000) {
        ctx.addIssue({ code: 'custom', path: ['classes', cls, 'seats'], message: '0 to 1000' })
      }
    }
  })
export type TrainFormValues = z.infer<typeof trainSchema>
