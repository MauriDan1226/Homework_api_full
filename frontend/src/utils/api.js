const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Envoltura unica de fetch: adjunta el token, serializa el cuerpo y convierte
// cualquier respuesta no exitosa en un Error con el mensaje que manda la API.
async function request(endpoint, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo contactar con el servidor. Revisa tu conexion.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

// Construye ?status=...&priority=...&sort=... omitiendo los filtros vacios
function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) search.append(key, value);
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

export const signup = ({ name, email, password }) =>
  request('/users/signup', { method: 'POST', body: { name, email, password } });

export const signin = ({ email, password }) =>
  request('/users/signin', { method: 'POST', body: { email, password } });

export const getCurrentUser = (token) => request('/users/me', { token });

export const getTasks = (token, filters) => request(`/tasks${buildQuery(filters)}`, { token });

export const getTask = (token, id) => request(`/tasks/${id}`, { token });

export const createTask = (token, task) => request('/tasks', { method: 'POST', body: task, token });

export const updateTask = (token, id, updates) =>
  request(`/tasks/${id}`, { method: 'PATCH', body: updates, token });

export const deleteTask = (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token });
