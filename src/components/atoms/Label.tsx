import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

interface LabelProps extends ComponentProps<'label'> {
  required?: boolean
}

export default function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-slate-700', className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
    </label>
  )
}
