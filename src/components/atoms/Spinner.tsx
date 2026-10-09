import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'size-4', md: 'size-5', lg: 'size-8' }

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return <LoaderCircle aria-hidden="true" className={cn('animate-spin', sizes[size], className)} />
}
