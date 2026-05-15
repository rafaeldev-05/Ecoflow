const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type ApiRequestErrorOptions = {
  status?: number;
  isNetworkError?: boolean;
};

export class ApiRequestError extends Error {
  status?: number;
  isNetworkError: boolean;

  constructor(message: string, options: ApiRequestErrorOptions = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = options.status;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiRequestError('Nao foi possivel conectar com a API.', {
      isNetworkError: true,
    });
  }

  if (!response.ok) {
    let message = 'Erro ao comunicar com a API.';

    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Mantem a mensagem padrao quando a API nao retorna JSON.
    }

    throw new ApiRequestError(message, {
      status: response.status,
    });
  }

  try {
    return await response.json();
  } catch {
    throw new ApiRequestError('Resposta invalida da API.', {
      status: response.status,
    });
  }
}
