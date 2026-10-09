import { cn } from '../../utils/cn'

export const fieldClasses = (invalid?: boolean, extra?: string) =>
  cn(
    'block h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400',
    'focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500',
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100',
    extra,
  )
