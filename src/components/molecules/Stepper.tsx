import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StepperProps {
  steps: string[]
  current: number
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1 text-sm" aria-label="Booking progress">
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step} className="flex shrink-0 items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                done && 'bg-green-700 text-white',
                active && 'bg-brand-700 text-white',
                !done && !active && 'bg-slate-200 text-slate-600',
              )}
            >
              {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
            </span>
            <span className={cn(active ? 'font-semibold text-slate-900' : 'text-slate-500')}>{step}</span>
            {index < steps.length - 1 && <span aria-hidden="true" className="h-px w-6 bg-slate-300 sm:w-10" />}
          </li>
        )
      })}
    </ol>
  )
}
