import { WEEKDAY_SHORT } from '../../config/constants'
import { cn } from '../../utils/cn'

/** "M T W T F S S" strip with the operating days highlighted. */
export default function RunningDays({ runsOn }: { runsOn: number[] }) {
  const order = [1, 2, 3, 4, 5, 6, 0]
  const label = runsOn.length === 7 ? 'Runs daily' : `Runs on ${order.filter((d) => runsOn.includes(d)).map((d) => WEEKDAY_SHORT[d]).join(', ')}`

  return (
    <span className="inline-flex gap-0.5 font-mono text-[11px]" aria-label={label} title={label}>
      {order.map((day) => (
        <span
          key={day}
          aria-hidden="true"
          className={cn(runsOn.includes(day) ? 'font-semibold text-brand-700' : 'text-slate-300')}
        >
          {WEEKDAY_SHORT[day][0]}
        </span>
      ))}
    </span>
  )
}
