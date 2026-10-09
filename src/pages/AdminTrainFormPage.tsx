import { TrainTrack } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { buttonClasses } from '../components/atoms/buttonStyles'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import AddTrainForm, { type TrainInput } from '../components/organisms/AddTrainForm'
import { selectAllTrains, selectCustomTrains } from '../features/trains/trainSelectors'
import { trainAdded, trainUpdated } from '../features/trains/trainsSlice'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../hooks/useToast'
import { createId } from '../utils/format'

/** Handles both /admin/trains/new and /admin/trains/:trainId/edit. */
export default function AdminTrainFormPage() {
  const { trainId } = useParams()
  const isEdit = Boolean(trainId)
  useDocumentTitle(isEdit ? 'Edit train' : 'Add train')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const allTrains = useAppSelector(selectAllTrains)
  const customTrains = useAppSelector(selectCustomTrains)
  // Only admin-created trains are editable; seeded trains stay read-only.
  const existing = customTrains.find((train) => train.id === trainId)

  if (isEdit && !existing) {
    return (
      <EmptyState
        icon={TrainTrack}
        title="Train not found"
        description="Only trains added by an admin can be edited."
        action={
          <Link to="/admin/trains" className={buttonClasses('primary')}>
            Back to train routes
          </Link>
        }
      />
    )
  }

  const isNumberTaken = (number: string) => allTrains.some((train) => train.number === number && train.id !== trainId)

  const handleSubmit = (input: TrainInput) => {
    if (existing) {
      dispatch(trainUpdated({ ...existing, ...input }))
      showToast(`Train ${input.number} updated.`)
    } else {
      dispatch(trainAdded({ ...input, id: createId('train'), origin: 'ADMIN' }))
      showToast(`Train ${input.number} ${input.name} added. Customers can now find it in search.`)
    }
    navigate('/admin/trains')
  }

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${existing?.number} ${existing?.name}` : 'Add a train route'}
        description="New routes show up in customer search results immediately."
        breadcrumbs={[{ label: 'Train routes', to: '/admin/trains' }, { label: isEdit ? 'Edit' : 'New train' }]}
      />
      <AddTrainForm
        initialTrain={existing}
        isNumberTaken={isNumberTaken}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/trains')}
      />
    </>
  )
}
