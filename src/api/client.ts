const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[] | undefined>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[] | undefined>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      typeof data.message === 'string' ? data.message : 'Erro na requisição.',
      response.status,
      data.errors,
    )
  }

  return data as T
}
