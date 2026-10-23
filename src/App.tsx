import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import type { Task, TaskInput } from './types/task'
import './App.css'

function App() {
  const {
    tasks,
    totalCount,
    query,
    setQuery,
    loading,
    saving,
    error,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  async function handleSubmit(input: TaskInput) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, input)
        setEditingTask(null)
        return
      }
      await addTask(input)
    } catch {
      // erro já tratado no hook
    }
  }

  async function handleDelete(id: string) {
    try {
      if (editingTask?.id === id) {
        setEditingTask(null)
      }
      await deleteTask(id)
    } catch {
      // erro já tratado no hook
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand-row">
          <span className="app__mark" aria-hidden="true">
            C
          </span>
          <p className="app__brand">Climba</p>
        </div>
        <h1>Lista de tarefas</h1>
        <p className="app__subtitle">
          Organize, filtre e acompanhe o status das suas entregas com clareza.
        </p>
      </header>

      {error && (
        <div className="app__alert" role="alert">
          {error}
        </div>
      )}

      <main className="app__layout">
        <section
          className={`panel panel--form ${editingTask ? 'panel--editing' : ''}`}
          aria-label="Formulário de tarefa"
        >
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => setEditingTask(null)}
            disabled={saving}
          />
        </section>

        <section className="panel panel--list" aria-label="Lista de tarefas">
          <div className="list-toolbar">
            <div className="list-toolbar__top">
              <div>
                <h2>Suas tarefas</h2>
                <p>
                  {loading
                    ? 'Sincronizando com a API...'
                    : totalCount === 0
                      ? 'Comece criando a primeira tarefa'
                      : `${tasks.length} de ${totalCount} visíveis`}
                </p>
              </div>
              {!loading && totalCount > 0 && (
                <span className="count-pill">{totalCount} no total</span>
              )}
            </div>
            <SearchBar value={query} onChange={setQuery} />
          </div>

          {loading ? (
            <div className="empty-state empty-state--loading">
              <div className="empty-state__icon" aria-hidden="true">
                …
              </div>
              <h3>Carregando tarefas</h3>
              <p>Buscando dados na API...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              query={query}
              totalCount={totalCount}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
