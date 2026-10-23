import { useEffect, useId, useRef, useState } from 'react'
import type { TaskStatus } from '../types/task'
import { TASK_STATUS_LABEL } from '../types/task'

interface StatusSelectProps {
  value: TaskStatus
  onChange: (value: TaskStatus) => void
  disabled?: boolean
}

const OPTIONS = Object.keys(TASK_STATUS_LABEL) as TaskStatus[]

export function StatusSelect({ value, onChange, disabled = false }: StatusSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectOption(status: TaskStatus) {
    onChange(status)
    setOpen(false)
  }

  return (
    <div className={`status-select ${open ? 'status-select--open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="status-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={`status-select__value status-select__value--${value.toLowerCase()}`}>
          {TASK_STATUS_LABEL[value]}
        </span>
        <span className="status-select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul className="status-select__list" id={listId} role="listbox">
          {OPTIONS.map((status) => {
            const selected = status === value
            return (
              <li key={status} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`status-select__option ${selected ? 'status-select__option--selected' : ''}`}
                  onClick={() => selectOption(status)}
                >
                  <span
                    className={`status-select__dot status-select__dot--${status.toLowerCase()}`}
                    aria-hidden="true"
                  />
                  {TASK_STATUS_LABEL[status]}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
