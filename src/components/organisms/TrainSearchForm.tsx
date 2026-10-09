import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftRight, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { seedStations } from '../../data/seedStations'
import { todayISO } from '../../utils/dateUtils'
import { cn } from '../../utils/cn'
import { searchSchema, type SearchValues } from '../../validation/schemas'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import FormField from '../molecules/FormField'

interface TrainSearchFormProps {
  defaultValues?: Partial<SearchValues>
  onSearch: (values: SearchValues) => void
  className?: string
}

export default function TrainSearchForm({ defaultValues, onSearch, className }: TrainSearchFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { from: '', to: '', date: todayISO(), ...defaultValues },
  })

  const swapStations = () => {
    const { from, to } = getValues()
    setValue('from', to, { shouldValidate: isSubmitted })
    setValue('to', from, { shouldValidate: isSubmitted })
  }

  const stationOptions = seedStations.map((station) => (
    <option key={station.code} value={station.code}>
      {station.name} ({station.code})
    </option>
  ))

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      className={cn('grid gap-4 md:grid-cols-[1fr_auto_1fr_11rem_auto] md:items-start', className)}
      aria-label="Search trains"
    >
      <FormField label="From" htmlFor="search-from" error={errors.from?.message}>
        <Select id="search-from" invalid={!!errors.from} aria-describedby="search-from-msg" {...register('from')}>
          <option value="">Select station</option>
          {stationOptions}
        </Select>
      </FormField>

      <div className="flex justify-center md:pt-7">
        <button
          type="button"
          onClick={swapStations}
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:border-brand-500 hover:text-brand-700"
          aria-label="Swap source and destination"
          title="Swap stations"
        >
          <ArrowLeftRight aria-hidden="true" className="size-4 rotate-90 md:rotate-0" />
        </button>
      </div>

      <FormField label="To" htmlFor="search-to" error={errors.to?.message}>
        <Select id="search-to" invalid={!!errors.to} aria-describedby="search-to-msg" {...register('to')}>
          <option value="">Select station</option>
          {stationOptions}
        </Select>
      </FormField>

      <FormField label="Journey date" htmlFor="search-date" error={errors.date?.message}>
        <Input
          id="search-date"
          type="date"
          min={todayISO()}
          invalid={!!errors.date}
          aria-describedby="search-date-msg"
          {...register('date')}
        />
      </FormField>

      <div className="md:pt-6">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          <Search aria-hidden="true" className="size-4" />
          Search
        </Button>
      </div>
    </form>
  )
}
