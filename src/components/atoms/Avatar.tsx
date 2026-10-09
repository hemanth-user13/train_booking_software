import { initials } from '../../utils/format'

export default function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800"
    >
      {initials(name)}
    </span>
  )
}
