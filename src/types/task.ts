export type TaskStatus = 'PENDENTE' | 'CONCLUIDA'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  createdAt: string
}

export type TaskInput = Omit<Task, 'id' | 'createdAt'>

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  PENDENTE: 'Pendente',
  CONCLUIDA: 'Concluída',
}
