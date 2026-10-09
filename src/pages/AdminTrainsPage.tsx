import { Eye, Pencil, Plus, Trash, TrainTrack } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Badge from '../components/atoms/Badge'
import Button from '../components/atoms/Button'
import { buttonClasses } from '../components/atoms/buttonStyles'
import Card from '../components/atoms/Card'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import RunningDays from '../components/molecules/RunningDays'
import SegmentedTabs from '../components/molecules/SegmentedTabs'
import TrainSummary from '../components/molecules/TrainSummary'
import Modal from '../components/organisms/Modal'
import { CLASS_LABELS } from '../config/constants'
import { seedTrains } from '../data/seedTrains'
import { selectCustomTrains } from '../features/trains/trainSelectors'
import { trainDeleted } from '../features/trains/trainsSlice'
import type { Train } from '../features/trains/trainTypes'
import { useConfirmation } from '../hooks/useConfirmation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../hooks/useToast'
import { formatINR } from '../utils/format'

type Tab = 'ADMIN' | 'SEED'

export default function AdminTrainsPage() {
  useDocumentTitle('Train routes')
  const dispatch = useAppDispatch()
  const customTrains = useAppSelector(selectCustomTrains)
  const { showToast } = useToast()
  const { confirm, dialog } = useConfirmation()
  const [tab, setTab] = useState<Tab>('ADMIN')
  const [viewing, setViewing] = useState<Train | null>(null)

  const trains = tab === 'ADMIN' ? customTrains : seedTrains

  const handleDelete = async (train: Train) => {
    const accepted = await confirm({
      title: `Delete ${train.number} ${train.name}?`,
      description: 'The train will disappear from customer search. Tickets already booked on it are kept.',
      confirmText: 'Delete train',
      cancelText: 'Keep train',
      variant: 'danger',
    })
    if (!accepted) return
    dispatch(trainDeleted(train.id))
    showToast(`Train ${train.number} deleted.`)
  }

  return (
    <>
      <PageHeader
        title="Train routes"
        description="Add routes for customers to book. Seeded demo routes are read-only."
        actions={
          <Link to="/admin/trains/new" className={buttonClasses('primary')}>
            <Plus aria-hidden="true" className="size-4" /> Add train
          </Link>
        }
      />

      <div className="mb-4">
        <SegmentedTabs
          label="Train source"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'ADMIN', label: 'Added by admin', count: customTrains.length },
            { value: 'SEED', label: 'Seeded demo data', count: seedTrains.length },
          ]}
        />
      </div>

      {trains.length === 0 ? (
        <EmptyState
          icon={TrainTrack}
          title="No custom trains yet"
          description="Trains you add here appear in customer search results straight away."
          action={
            <Link to="/admin/trains/new" className={buttonClasses('primary')}>
              <Plus aria-hidden="true" className="size-4" /> Add your first train
            </Link>
          }
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Train</th>
                <th scope="col" className="px-4 py-3 font-medium">Route</th>
                <th scope="col" className="px-4 py-3 font-medium">Timing</th>
                <th scope="col" className="px-4 py-3 font-medium">Days</th>
                <th scope="col" className="px-4 py-3 font-medium">Classes</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trains.map((train) => (
                <tr key={train.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{train.name}</p>
                    <p className="font-mono text-xs text-slate-500">{train.number}</p>
                  </td>
                  <td className="px-4 py-3">
                    {train.from} → {train.to}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {train.departure} – {train.arrival}
                  </td>
                  <td className="px-4 py-3">
                    <RunningDays runsOn={train.runsOn} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {train.classes.map((cls) => (
                        <Badge key={cls} tone="brand">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(train)} aria-label={`View ${train.name}`}>
                        <Eye aria-hidden="true" className="size-4" />
                      </Button>
                      {train.origin === 'ADMIN' && (
                        <>
                          <Link
                            to={`/admin/trains/${train.id}/edit`}
                            className={buttonClasses('ghost', 'sm')}
                            aria-label={`Edit ${train.name}`}
                          >
                            <Pencil aria-hidden="true" className="size-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(train)}
                            aria-label={`Delete ${train.name}`}
                          >
                            <Trash aria-hidden="true" className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? `${viewing.number} ${viewing.name}` : ''}
        description={viewing?.origin === 'SEED' ? 'Seeded demo route (read-only)' : 'Added by admin'}
        size="lg"
      >
        {viewing && (
          <div className="space-y-5">
            <TrainSummary train={viewing} />
            <div className="flex items-center gap-2 text-sm text-slate-600">
              Operating days: <RunningDays runsOn={viewing.runsOn} />
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="pb-2 font-medium">Class</th>
                  <th scope="col" className="pb-2 font-medium">Fare</th>
                  <th scope="col" className="pb-2 font-medium">Seats per day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {viewing.classes.map((cls) => (
                  <tr key={cls}>
                    <td className="py-2">
                      {cls} <span className="text-slate-500">· {CLASS_LABELS[cls]}</span>
                    </td>
                    <td className="py-2 tabular-nums">{formatINR(viewing.fares[cls] ?? 0)}</td>
                    <td className="py-2 tabular-nums">{viewing.seats[cls] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      {dialog}
    </>
  )
}
