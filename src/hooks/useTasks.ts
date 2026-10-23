import { useCallback, useEffect, useState } from 'react'
import * as tasksApi from '../api/tasks'
import { ApiError } from '../api/client'
import type { Task, TaskInput } from '../types/task'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 250)

    return () => window.clearTimeout(timer)
  }, [query])

  const refresh = useCallback(async (search = debouncedQuery) => {
    setLoading(true)
    setError(null)

    try {
      const [filtered, all] = await Promise.all([
        tasksApi.listTasks(search),
        search ? tasksApi.listTasks() : Promise.resolve(null),
      ])

      setTasks(filtered)
      setTotalCount(all ? all.length : filtered.length)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar as tarefas.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    void refresh(debouncedQuery)
  }, [debouncedQuery, refresh])

  async function addTask(input: TaskInput) {
    setSaving(true)
    setError(null)
    try {
      await tasksApi.createTask(input)
      await refresh()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Não foi possível criar a tarefa.'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function updateTask(id: string, input: TaskInput) {
    setSaving(true)
    setError(null)
    try {
      await tasksApi.updateTask(id, input)
      await refresh()
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível atualizar a tarefa.'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask(id: string) {
    setSaving(true)
    setError(null)
    try {
      await tasksApi.deleteTask(id)
      await refresh()
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível excluir a tarefa.'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return {
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
    refresh,
  }
}
