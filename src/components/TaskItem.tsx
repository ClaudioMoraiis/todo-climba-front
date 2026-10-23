import type { Task } from '../types/task'
import { TASK_STATUS_LABEL } from '../types/task'

interface TaskItemProps {
  task: Task
  index?: number
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function TaskItem({ task, index = 0, onEdit, onDelete }: TaskItemProps) {
  const isDone = task.status === 'CONCLUIDA'

  return (
    <article
      className={`task-item ${isDone ? 'task-item--done' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="task-item__main">
        <div className="task-item__top">
          <h3>{task.title}</h3>
          <span className={`status-badge status-badge--${task.status.toLowerCase()}`}>
            {TASK_STATUS_LABEL[task.status]}
          </span>
        </div>

        {task.description && <p className="task-item__description">{task.description}</p>}

        <div className="task-item__meta">
          <time className="task-item__date" dateTime={task.dueDate}>
            <span className="task-item__date-dot" aria-hidden="true" />
            Prevista para {formatDate(task.dueDate)}
          </time>
        </div>
      </div>

      <div className="task-item__actions">
        <button type="button" className="btn btn--ghost" onClick={() => onEdit(task)}>
          Editar
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(task.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  )
}
