/**
 * Base configuration and helper functions for API requests to the backend.
 */

// Use NEXT_PUBLIC_API_URL from .env if available, otherwise default to local dev server
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_V1_PREFIX = `${API_BASE_URL}/api/v1`;

interface FetchOptions extends RequestInit {
  // Add any custom options here
}

/**
 * A wrapper around native fetch that prepends the base URL and handles JSON parsing.
 */
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Example function to test the connection to the backend root endpoint.
 */
export async function checkBackendHealth() {
  return fetchApi<{ message: string }>('/');
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  project_id?: number;
}

export interface ChatResponse {
  role: 'ai';
  content: string;
}

export async function sendChatMessage(request: ChatRequest) {
  return fetchApi<ChatResponse>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export interface ChatMessageResponse {
  id: number;
  project_id: number;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export async function getChatHistory(projectId: number) {
  return fetchApi<ChatMessageResponse[]>(`/api/v1/chat/${projectId}`);
}

export async function clearChatHistory(projectId: number) {
  return fetchApi<{ message: string }>(`/api/v1/chat/${projectId}`, {
    method: 'DELETE',
  });
}

export interface ProjectCreate {
  title: string;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  title: string;
  description?: string;
  owner_id: number;
}

export async function createProject(request: ProjectCreate) {
  return fetchApi<ProjectResponse>('/api/v1/projects/', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getProjects() {
  return fetchApi<ProjectResponse[]>('/api/v1/projects/');
}

export interface ProposalCreate {
  project_id: number;
  version?: number;
  status?: string;
  content?: Record<string, any>;
}

export interface ProposalResponse {
  id: number;
  project_id: number;
  version: number;
  status: string;
  content: Record<string, any>;
}

export async function createProposal(request: ProposalCreate) {
  return fetchApi<ProposalResponse>('/api/v1/proposals/', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getProposalsByProject(projectId: number) {
  return fetchApi<ProposalResponse[]>(`/api/v1/proposals/project/${projectId}`);
}

export interface GeneratedProposal {
  title: string;
  sections: {
    summary: string;
    objectives: string;
    methodology: string;
  };
}

export async function generateProposalDocument(projectId: number) {
  return fetchApi<GeneratedProposal>(`/api/v1/generate/${projectId}`, {
    method: 'POST'
  });
}
