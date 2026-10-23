import type { TaskInput } from '../types/task'

export type TaskErrors = Partial<Record<keyof TaskInput, string>>

export function isValidDate(value: string): boolean {
  if (!value) return false
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function todayIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isNotPastDate(value: string): boolean {
  return isValidDate(value) && value >= todayIsoDate()
}

export function validateTask(input: TaskInput): TaskErrors {
  const errors: TaskErrors = {}

  if (!input.title.trim()) {
    errors.title = 'O título é obrigatório.'
  }

  if (!input.dueDate) {
    errors.dueDate = 'A data prevista é obrigatória.'
  } else if (!isValidDate(input.dueDate)) {
    errors.dueDate = 'Informe uma data válida.'
  } else if (!isNotPastDate(input.dueDate)) {
    errors.dueDate = 'A data prevista não pode ser anterior a hoje.'
  }

  return errors
}
