import { useEffect, useState, type FormEvent } from 'react'
import type { Task, TaskInput } from '../types/task'
import { StatusSelect } from './StatusSelect'
import { type TaskErrors, validateTask } from '../utils/validation'

function todayIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface TaskFormProps {
  initialTask?: Task | null
  onSubmit: (input: TaskInput) => void | Promise<void>
  onCancel?: () => void
  disabled?: boolean
}

const EMPTY_FORM: TaskInput = {
  title: '',
  description: '',
  dueDate: '',
  status: 'PENDENTE',
}

export function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  disabled = false,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskInput>(EMPTY_FORM)
  const [errors, setErrors] = useState<TaskErrors>({})

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description,
        dueDate: initialTask.dueDate,
        status: initialTask.status,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [initialTask])

  function handleChange<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (disabled) return

    const nextErrors = validateTask(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    })

    if (!initialTask) {
      setForm(EMPTY_FORM)
    }
  }

  const isEditing = Boolean(initialTask)

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__header">
        <div>
          <h2>{isEditing ? 'Editar tarefa' : 'Nova tarefa'}</h2>
          <p>
            {isEditing
              ? 'Atualize os campos e salve as alterações.'
              : 'Preencha os dados para adicionar à lista.'}
          </p>
        </div>
        <span className="mode-chip">{isEditing ? 'Edição' : 'Criação'}</span>
      </div>

      <fieldset className="task-form__fieldset" disabled={disabled}>
        <div className="task-form__grid">
          <label className="field field--full">
            <span>Título *</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="Ex.: Preparar entrega do teste"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <span id="title-error" className="field__error">
                {errors.title}
              </span>
            )}
          </label>

          <label className="field field--full">
            <span>Descrição</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              placeholder="Detalhes opcionais da tarefa"
              rows={3}
            />
          </label>

          <label className="field">
            <span>Data prevista *</span>
            <input
              type="date"
              value={form.dueDate}
              min={todayIsoDate()}
              onChange={(event) => handleChange('dueDate', event.target.value)}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
            />
            {errors.dueDate && (
              <span id="dueDate-error" className="field__error">
                {errors.dueDate}
              </span>
            )}
          </label>

          <div className="field">
            <span id="status-label">Status</span>
            <StatusSelect
              value={form.status}
              disabled={disabled}
              onChange={(status) => handleChange('status', status)}
            />
          </div>
        </div>

        <div className="task-form__actions">
          {isEditing && onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            {disabled
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Adicionar tarefa'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
