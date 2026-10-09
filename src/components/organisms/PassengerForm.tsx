import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BERTH_LABELS, GENDER_LABELS } from '../../config/constants'
import type { BerthPreference, Gender } from '../../types/common'
import { passengerSchema, type PassengerValues } from '../../validation/schemas'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import FormField from '../molecules/FormField'

interface PassengerFormProps {
  defaultValues?: Partial<PassengerValues>
  submitLabel?: string
  /** Shows a "save to my passengers" checkbox (used during booking). */
  showSaveOption?: boolean
  onSubmit: (values: PassengerValues, options: { save: boolean }) => void
  onCancel?: () => void
}

export default function PassengerForm({
  defaultValues,
  submitLabel = 'Save passenger',
  showSaveOption = false,
  onSubmit,
  onCancel,
}: PassengerFormProps) {
  const id = useId()
  const [save, setSave] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerValues>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { name: '', gender: 'MALE', berth: 'NONE', ...defaultValues },
  })

  const submit = (values: PassengerValues) => {
    onSubmit(values, { save: showSaveOption && save })
    if (showSaveOption) reset({ name: '', gender: 'MALE', berth: 'NONE' })
  }

  const fieldId = (name: string) => `${id}-${name}`

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
        <FormField label="Full name" htmlFor={fieldId('name')} error={errors.name?.message} required>
          <Input
            id={fieldId('name')}
            data-autofocus
            invalid={!!errors.name}
            aria-describedby={`${fieldId('name')}-msg`}
            placeholder="As on ID proof"
            {...register('name')}
          />
        </FormField>
        <FormField label="Age" htmlFor={fieldId('age')} error={errors.age?.message} required>
          <Input
            id={fieldId('age')}
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            invalid={!!errors.age}
            aria-describedby={`${fieldId('age')}-msg`}
            {...register('age', { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Gender" htmlFor={fieldId('gender')} error={errors.gender?.message} required>
          <Select id={fieldId('gender')} invalid={!!errors.gender} {...register('gender')}>
            {(Object.keys(GENDER_LABELS) as Gender[]).map((gender) => (
              <option key={gender} value={gender}>
                {GENDER_LABELS[gender]}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Berth preference" htmlFor={fieldId('berth')} error={errors.berth?.message}>
          <Select id={fieldId('berth')} {...register('berth')}>
            {(Object.keys(BERTH_LABELS) as BerthPreference[]).map((berth) => (
              <option key={berth} value={berth}>
                {BERTH_LABELS[berth]}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {showSaveOption ? (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
              className="size-4 rounded border-slate-300 accent-brand-700"
            />
            Save to my passenger list
          </label>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </div>
    </form>
  )
}
