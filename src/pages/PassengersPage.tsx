import { Pencil, Plus, Trash, Users } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Button from '../components/atoms/Button'
import Card from '../components/atoms/Card'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import PassengerRow from '../components/molecules/PassengerRow'
import Modal from '../components/organisms/Modal'
import PassengerForm from '../components/organisms/PassengerForm'
import { selectCurrentUser } from '../features/auth/authSelectors'
import {
  passengerAdded,
  passengerDeleted,
  passengerUpdated,
  selectMyPassengers,
} from '../features/passengers/passengersSlice'
import type { Passenger } from '../features/passengers/passengerTypes'
import { useConfirmation } from '../hooks/useConfirmation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../hooks/useToast'
import { createId } from '../utils/format'
import type { PassengerValues } from '../validation/schemas'

type EditorState = { mode: 'add' } | { mode: 'edit'; passenger: Passenger } | null

export default function PassengersPage() {
  useDocumentTitle('Saved passengers')
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const passengers = useAppSelector(selectMyPassengers)
  const { showToast } = useToast()
  const { confirm, dialog } = useConfirmation()
  const [editor, setEditor] = useState<EditorState>(null)

  const handleSave = (values: PassengerValues) => {
    if (!user || !editor) return
    if (editor.mode === 'edit') {
      dispatch(passengerUpdated({ ...editor.passenger, ...values }))
      showToast(`${values.name} updated.`)
    } else {
      dispatch(passengerAdded({ id: createId('psg'), userId: user.id, ...values }))
      showToast(`${values.name} added to your passengers.`)
    }
    setEditor(null)
  }

  const handleDelete = async (passenger: Passenger) => {
    const accepted = await confirm({
      title: `Delete ${passenger.name}?`,
      description: 'They will be removed from your saved passengers. Existing tickets are not affected.',
      confirmText: 'Delete passenger',
      cancelText: 'Keep',
      variant: 'danger',
    })
    if (!accepted) return
    dispatch(passengerDeleted(passenger.id))
    showToast(`${passenger.name} deleted.`)
  }

  return (
    <>
      <PageHeader
        title="Saved passengers"
        description="Add family and frequent co-travellers once and pick them while booking."
        actions={
          passengers.length > 0 && (
            <Button onClick={() => setEditor({ mode: 'add' })}>
              <Plus aria-hidden="true" className="size-4" /> Add passenger
            </Button>
          )
        }
      />

      {passengers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No saved passengers yet"
          description="Saved passengers can be added to a ticket in one click."
          action={
            <Button onClick={() => setEditor({ mode: 'add' })}>
              <Plus aria-hidden="true" className="size-4" /> Add passenger
            </Button>
          }
        />
      ) : (
        <Card className="divide-y divide-slate-100 px-4">
          {passengers.map((passenger) => (
            <PassengerRow
              key={passenger.id}
              passenger={passenger}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditor({ mode: 'edit', passenger })}
                    aria-label={`Edit ${passenger.name}`}
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(passenger)}
                    aria-label={`Delete ${passenger.name}`}
                  >
                    <Trash aria-hidden="true" className="size-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </>
              }
            />
          ))}
        </Card>
      )}

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === 'edit' ? 'Edit passenger' : 'Add passenger'}
      >
        {editor && (
          <PassengerForm
            defaultValues={editor.mode === 'edit' ? editor.passenger : undefined}
            submitLabel={editor.mode === 'edit' ? 'Save changes' : 'Add passenger'}
            onSubmit={handleSave}
            onCancel={() => setEditor(null)}
          />
        )}
      </Modal>
      {dialog}
    </>
  )
}
