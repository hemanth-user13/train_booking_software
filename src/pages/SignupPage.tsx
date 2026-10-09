import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import FormField from '../components/molecules/FormField'
import { selectUsers } from '../features/auth/authSelectors'
import { loggedIn, userRegistered } from '../features/auth/authSlice'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../hooks/useToast'
import { isEmailTaken } from '../services/authService'
import { createId } from '../utils/format'
import { signupSchema, type SignupValues } from '../validation/schemas'

export default function SignupPage() {
  useDocumentTitle('Create account')
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = (values: SignupValues) => {
    if (isEmailTaken(users, values.email)) {
      setError('email', { message: 'An account with this email already exists' })
      return
    }

    const id = createId('user')
    dispatch(
      userRegistered({
        id,
        name: values.name,
        email: values.email.toLowerCase(),
        password: values.password,
        phone: '',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      }),
    )
    dispatch(loggedIn(id))
    showToast('Your account is ready. Happy travels!')
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
        <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" autoComplete="name" invalid={!!errors.name} aria-describedby="name-msg" {...register('name')} />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            aria-describedby="email-msg"
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="At least 8 characters, with a letter and a number."
          required
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            aria-describedby="password-msg"
            {...register('password')}
          />
        </FormField>

        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            aria-describedby="confirmPassword-msg"
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
        <p className="text-xs text-slate-500">
          This is a demo. Your details are saved in this browser only, so please don&apos;t reuse a real password.
        </p>
      </form>
    </>
  )
}
