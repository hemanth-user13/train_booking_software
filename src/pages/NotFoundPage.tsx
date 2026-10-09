import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/atoms/buttonStyles'
import BrandMark from '../components/molecules/BrandMark'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <BrandMark />
      <p className="mt-10 font-mono text-sm text-brand-700">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">This platform doesn&apos;t exist</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-600">
        The page you were looking for has moved or never existed. Let&apos;s get you back on track.
      </p>
      <Link to="/" className={buttonClasses('primary', 'md', 'mt-6')}>
        Go to home
      </Link>
    </div>
  )
}
