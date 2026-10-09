import type { ComponentProps } from 'react'
import { fieldClasses } from './fieldStyles'

interface InputProps extends ComponentProps<'input'> {
  invalid?: boolean
}

export default function Input({ invalid, className, ...props }: InputProps) {
  return <input aria-invalid={invalid || undefined} className={fieldClasses(invalid, className)} {...props} />
}
