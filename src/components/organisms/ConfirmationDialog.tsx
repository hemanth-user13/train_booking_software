import type { ReactNode } from 'react'
import Button from '../atoms/Button'
import Alert from '../molecules/Alert'
import Modal from './Modal'

export type ConfirmVariant = 'default' | 'danger'

export interface ConfirmationDialogProps {
  open: boolean
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

/** Pure UI: it never performs the business action itself, it only reports the choice. */
export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      role="alertdialog"
      dismissible={!loading}
      size="sm"
      footer={
        <>
          {/* Destructive dialogs focus the safe option first. */}
          <Button variant="secondary" onClick={onCancel} disabled={loading} data-autofocus={variant === 'danger' || undefined}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            data-autofocus={variant !== 'danger' || undefined}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
    </Modal>
  )
}
