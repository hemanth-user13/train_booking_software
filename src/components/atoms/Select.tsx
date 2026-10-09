import type { ComponentProps } from 'react'
import { fieldClasses } from './fieldStyles'

interface SelectProps extends ComponentProps<'select'> {
  invalid?: boolean
}

export default function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <select aria-invalid={invalid || undefined} className={fieldClasses(invalid, className)} {...props}>
      {children}
    </select>
  )
}
