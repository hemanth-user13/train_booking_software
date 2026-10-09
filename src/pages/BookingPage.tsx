import { TrainTrack } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Button from '../components/atoms/Button'
import { buttonClasses } from '../components/atoms/buttonStyles'
import Card from '../components/atoms/Card'
import Alert from '../components/molecules/Alert'
import AvailabilityBadge from '../components/molecules/AvailabilityBadge'
import EmptyState from '../components/molecules/EmptyState'
import FareBreakdown from '../components/molecules/FareBreakdown'
import PageHeader from '../components/molecules/PageHeader'
import Stepper from '../components/molecules/Stepper'
import TrainSummary from '../components/molecules/TrainSummary'
import BookingSummary from '../components/organisms/BookingSummary'
import ClassQuotaStep from '../components/organisms/ClassQuotaStep'
import PassengerStep, { type DraftPassenger } from '../components/organisms/PassengerStep'
import PaymentStep from '../components/organisms/PaymentStep'
import { MAX_PASSENGERS_PER_BOOKING, QUOTA_LABELS, QUOTAS } from '../config/constants'
import { selectCurrentUser } from '../features/auth/authSelectors'
import { selectAllBookings } from '../features/bookings/bookingSelectors'
import { bookingCreated } from '../features/bookings/bookingsSlice'
import { passengerAdded, selectMyPassengers } from '../features/passengers/passengersSlice'
import { selectMyPaymentMethods } from '../features/payments/paymentsSlice'
import { selectTrainById } from '../features/trains/trainSelectors'
import { useAddPaymentMethod } from '../hooks/useAddPaymentMethod'
import { useConfirmation } from '../hooks/useConfirmation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../hooks/useToast'
import { buildBooking } from '../services/bookingService'
import { paymentMethodLabel, processMockPayment } from '../services/paymentService'
import { getAvailability, runsOnDate } from '../services/trainService'
import type { Passenger } from '../features/passengers/passengerTypes'
import type { Quota, TravelClass } from '../types/common'
import { isPastDate, todayISO, weekdayOf } from '../utils/dateUtils'
import { calculateFare } from '../utils/fareCalculator'
import { createId, formatINR } from '../utils/format'
import type { PassengerValues } from '../validation/schemas'

const STEPS = ['Class & quota', 'Passengers', 'Review', 'Payment']

export default function BookingPage() {
  useDocumentTitle('Book ticket')
  const { trainId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const { confirm, dialog } = useConfirmation()
  const addPaymentMethod = useAddPaymentMethod()

  const user = useAppSelector(selectCurrentUser)
  const train = useAppSelector((state) => selectTrainById(state, trainId))
  const bookings = useAppSelector(selectAllBookings)
  const savedPassengers = useAppSelector(selectMyPassengers)
  const methods = useAppSelector(selectMyPaymentMethods)

  const paramClass = params.get('class') as TravelClass | null
  const paramQuota = params.get('quota') as Quota | null
  const paramDate = params.get('date')

  const [step, setStep] = useState(0)
  const [journeyDate, setJourneyDate] = useState(paramDate && !isPastDate(paramDate) ? paramDate : todayISO())
  const [travelClass, setTravelClass] = useState<TravelClass | undefined>(
    paramClass && train?.classes.includes(paramClass) ? paramClass : train?.classes[0],
  )
  const [quota, setQuota] = useState<Quota>(paramQuota && QUOTAS.includes(paramQuota) ? paramQuota : 'GENERAL')
  const [passengers, setPassengers] = useState<DraftPassenger[]>([])
  const [stepError, setStepError] = useState<string | null>(null)
  const [methodId, setMethodId] = useState<string | null>(methods[0]?.id ?? null)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // One id per checkout: retries after a failed payment reuse it, so a booking can never be stored twice.
  const bookingIdRef = useRef(createId('bkg'))
  const payingRef = useRef(false)

  if (!train || !travelClass || !user) {
    return (
      <EmptyState
        icon={TrainTrack}
        title="Train not found"
        description="This train may have been removed. Please search again."
        action={
          <Link to="/customer/search" className={buttonClasses('primary')}>
            Search trains
          </Link>
        }
      />
    )
  }

  const availability = getAvailability(train, travelClass, quota, journeyDate, bookings)
  const maxPassengers = Math.min(MAX_PASSENGERS_PER_BOOKING, availability.bookableCount)
  const fare = calculateFare(train.fares[travelClass] ?? 0, travelClass, quota, Math.max(passengers.length, 1))

  const dateError = isPastDate(journeyDate)
    ? 'Journey date cannot be in the past'
    : !runsOnDate(train, journeyDate)
      ? `${train.name} does not run on ${['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][weekdayOf(journeyDate)]}`
      : undefined

  /* ---------- step validation ---------- */

  const validateStep = (current: number): string | null => {
    if (current === 0) {
      if (dateError) return dateError
      if (availability.status === 'NOT_AVAILABLE') return 'No seats or waitlist left. Try another class, quota or date.'
    }
    if (current === 1) {
      if (passengers.length === 0) return 'Add at least one passenger.'
      if (passengers.length > maxPassengers) {
        return `Only ${maxPassengers} passenger(s) can be booked in ${travelClass} (${QUOTA_LABELS[quota]}) right now.`
      }
      if (quota === 'LADIES' && passengers.some((p) => p.gender !== 'FEMALE')) {
        return 'Ladies quota tickets can only include female passengers.'
      }
    }
    return null
  }

  const goNext = () => {
    const error = validateStep(step)
    setStepError(error)
    if (!error) setStep((s) => s + 1)
  }

  const goBack = () => {
    setStepError(null)
    setStep((s) => s - 1)
  }

  /* ---------- passengers ---------- */

  const toggleSaved = (saved: Passenger) => {
    setStepError(null)
    setPassengers((current) =>
      current.some((p) => p.savedId === saved.id)
        ? current.filter((p) => p.savedId !== saved.id)
        : [...current, { key: createId('draft'), savedId: saved.id, name: saved.name, age: saved.age, gender: saved.gender, berth: saved.berth }],
    )
  }

  const addNewPassenger = (values: PassengerValues, save: boolean) => {
    setStepError(null)
    let savedId: string | undefined
    if (save) {
      savedId = createId('psg')
      dispatch(passengerAdded({ id: savedId, userId: user.id, ...values }))
    }
    setPassengers((current) => [...current, { key: createId('draft'), savedId, ...values }])
  }

  /* ---------- payment ---------- */

  const handlePay = async () => {
    if (payingRef.current) return
    const method = methods.find((m) => m.id === methodId)
    if (!method) {
      setPaymentError('Choose a payment method.')
      return
    }

    const accepted = await confirm({
      title: 'Confirm booking',
      description: `Pay ${formatINR(fare.total)} with ${paymentMethodLabel(method)} for ${passengers.length} passenger(s) on ${train.number} ${train.name}.`,
      confirmText: `Pay ${formatINR(fare.total)}`,
      cancelText: 'Not yet',
    })
    if (!accepted || payingRef.current) return

    payingRef.current = true
    setProcessing(true)
    setPaymentError(null)

    const result = await processMockPayment(simulateFailure)
    if (!result.success) {
      payingRef.current = false
      setProcessing(false)
      setPaymentError(result.message)
      return
    }

    const booking = buildBooking({
      bookingId: bookingIdRef.current,
      userId: user.id,
      train,
      journeyDate,
      travelClass,
      quota,
      passengers: passengers.map(({ name, age, gender, berth }) => ({ name, age, gender, berth })),
      paymentLabel: paymentMethodLabel(method),
      existingBookings: bookings,
    })

    if (typeof booking === 'string') {
      payingRef.current = false
      setProcessing(false)
      setPaymentError(`${booking} Your payment was not captured.`)
      return
    }

    dispatch(bookingCreated(booking))
    showToast(`Booking successful. PNR ${booking.pnr}`)
    navigate(`/customer/booking-confirmation/${booking.id}`, { replace: true })
  }

  return (
    <>
      <PageHeader
        title={`${train.number} ${train.name}`}
        breadcrumbs={[
          { label: 'Search', to: '/customer/search' },
          {
            label: 'Results',
            to: `/customer/trains?${new URLSearchParams({ from: train.from, to: train.to, date: journeyDate }).toString()}`,
          },
          { label: 'Book' },
        ]}
      />

      <div className="mb-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">{STEPS[step]}</h2>

          {stepError && (
            <Alert tone="error" className="mb-5">
              {stepError}
            </Alert>
          )}

          {step === 0 && (
            <ClassQuotaStep
              train={train}
              bookings={bookings}
              journeyDate={journeyDate}
              travelClass={travelClass}
              quota={quota}
              dateError={dateError}
              onDateChange={(date) => {
                setStepError(null)
                setJourneyDate(date)
              }}
              onClassChange={(cls) => {
                setStepError(null)
                setTravelClass(cls)
              }}
              onQuotaChange={(q) => {
                setStepError(null)
                setQuota(q)
              }}
            />
          )}

          {step === 1 && (
            <PassengerStep
              passengers={passengers}
              savedPassengers={savedPassengers}
              maxPassengers={maxPassengers}
              onToggleSaved={toggleSaved}
              onAddNew={addNewPassenger}
              onRemove={(key) => setPassengers((current) => current.filter((p) => p.key !== key))}
            />
          )}

          {step === 2 && (
            <div className="space-y-4">
              {availability.status === 'WAITLIST' && (
                <Alert tone="warning" title="This will be a waitlisted ticket">
                  Seats are full, so your passengers get waitlist numbers starting at WL {availability.nextWaitlistNumber}.
                </Alert>
              )}
              <BookingSummary
                train={train}
                journeyDate={journeyDate}
                travelClass={travelClass}
                quota={quota}
                passengers={passengers}
                fare={fare}
              />
            </div>
          )}

          {step === 3 && (
            <PaymentStep
              amount={fare.total}
              methods={methods}
              selectedMethodId={methodId}
              simulateFailure={simulateFailure}
              processing={processing}
              error={paymentError}
              onSelectMethod={setMethodId}
              onAddMethod={(input) => {
                const method = addPaymentMethod(input)
                if (method) setMethodId(method.id)
              }}
              onSimulateFailureChange={setSimulateFailure}
              onPay={handlePay}
              onBack={goBack}
            />
          )}

          {step < 3 && (
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <Button variant="secondary" onClick={goBack}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button onClick={goNext}>{step === 2 ? 'Continue to payment' : 'Continue'}</Button>
            </div>
          )}
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start" aria-label="Journey summary">
          <Card className="p-4">
            <TrainSummary train={train} journeyDate={journeyDate} />
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-600">
                {travelClass} · {QUOTA_LABELS[quota]}
              </span>
              <AvailabilityBadge availability={availability} />
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Fare {passengers.length === 0 && <span className="font-normal text-slate-500">(per passenger)</span>}
            </h3>
            <FareBreakdown fare={fare} />
          </Card>
        </aside>
      </div>
      {dialog}
    </>
  )
}
