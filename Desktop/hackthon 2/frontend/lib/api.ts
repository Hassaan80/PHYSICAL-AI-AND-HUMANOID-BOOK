import {
  SignUpFormData,
  SignInFormData,
  CreateTaskRequest,
  UpdateTaskRequest,
  AuthResponse,
  Task,
  ApiErrorResponse,
  isApiError,
  HttpStatus,
} from './types';

// ===== Configuration =====

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ===== Token Management =====

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

// ===== Request Helper =====

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Attach JWT token if authentication is required
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: response.statusText || 'An error occurred',
        },
        status: response.status,
      }));

      console.error('API Error:', {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Handle 401 Unauthorized - redirect to sign-in
      if (response.status === HttpStatus.UNAUTHORIZED) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      }

      throw errorData;
    }

    // Handle 204 No Content
    if (response.status === HttpStatus.NO_CONTENT) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Network Error:', {
      url,
      error,
    });

    // Network errors or JSON parsing errors
    if (isApiError(error)) {
      throw error;
    }

    // Network error
    const networkError = {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your internet connection.',
      },
      status: 0,
    } as ApiErrorResponse;
    console.error('Network error details:', networkError);
    throw networkError;
  }
}

// ===== Authentication API =====

export const authApi = {
  async signUp(data: SignUpFormData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    // Store token after successful sign-up
    if (response.data.token) {
      setToken(response.data.token);
    }

    return response;
  },

  async signIn(data: SignInFormData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token after successful sign-in
    if (response.data.token) {
      setToken(response.data.token);
    }

    return response;
  },

  async signOut(): Promise<void> {
    try {
      await apiRequest('/auth/signout', {
        method: 'POST',
        requiresAuth: true,
      });
    } finally {
      // Always clear token, even if API call fails
      removeToken();
    }
  },
};

// ===== Tasks API =====

export const tasksApi = {
  async getTasks(filters?: { completed?: boolean }): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (filters?.completed !== undefined) {
      queryParams.append('completed', String(filters.completed));
    }

    const queryString = queryParams.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<{ data: Task[] }>(endpoint, {
      method: 'GET',
      requiresAuth: true,
    });

    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiRequest<{ data: Task }>(`/tasks/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });

    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiRequest<{ data: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });

    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await apiRequest<{ data: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });

    return response.data;
  },

  async toggleTask(id: string, completed: boolean): Promise<Task> {
    const response = await apiRequest<{ data: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
      requiresAuth: true,
    });

    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};

// ===== API Client Export =====

export const apiClient = {
  auth: authApi,
  tasks: tasksApi,
  // Token management utilities
  getToken,
  setToken,
  removeToken,
};
