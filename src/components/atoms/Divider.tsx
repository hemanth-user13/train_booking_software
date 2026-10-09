import { cn } from '../../utils/cn'

export default function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-slate-200', className)} />
}
