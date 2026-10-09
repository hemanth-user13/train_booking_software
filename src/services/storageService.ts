import { STORAGE_VERSION } from '../config/constants'

/**
 * The only place in the app that touches localStorage.
 *
 * Note: localStorage is not a secure database. Anything stored here can be read
 * and edited by anyone with access to the browser. This app is a demo.
 */

interface Envelope<T> {
  version: number
  data: T
}

function read<T>(key: string, fallback: T, isValid: (value: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Envelope<T>
    if (parsed?.version !== STORAGE_VERSION || !isValid(parsed.data)) return fallback
    return parsed.data
  } catch {
    // Malformed JSON or storage blocked: start fresh rather than crash.
    return fallback
  }
}

function write<T>(key: string, data: T): void {
  try {
    const envelope: Envelope<T> = { version: STORAGE_VERSION, data }
    localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    // Storage full or blocked. The app keeps working in memory.
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const isArray = (value: unknown) => Array.isArray(value)
export const isStringOrNull = (value: unknown) => value === null || typeof value === 'string'

export const storageService = { read, write, remove }
