import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  query: string
  totalCount: number
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  query,
  totalCount,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (totalCount === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          +
        </div>
        <h3>Nenhuma tarefa ainda</h3>
        <p>Use o formulário ao lado para criar a primeira.</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          ?
        </div>
        <h3>Nenhum resultado</h3>
        <p>Não encontramos tarefas para “{query}”. Tente outro termo.</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
