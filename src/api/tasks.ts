import type { Task, TaskInput } from '../types/task'
import { apiRequest } from './client'

export function listTasks(query?: string): Promise<Task[]> {
  const params = new URLSearchParams()
  const normalized = query?.trim()
  if (normalized) {
    params.set('q', normalized)
  }

  const suffix = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<Task[]>(`/tasks${suffix}`)
}

export function createTask(input: TaskInput): Promise<Task> {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTask(id: string, input: TaskInput): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteTask(id: string): Promise<void> {
  return apiRequest<void>(`/tasks/${id}`, {
    method: 'DELETE',
  })
}
