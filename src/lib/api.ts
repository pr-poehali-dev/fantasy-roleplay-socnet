const API_BASE = 'https://functions.poehali.dev';

const ENDPOINTS = {
  characters: '5a1fe4ac-6a94-432f-9b30-afeb4cd72ffa',
  locations: '4c14d9ce-0d35-4b58-a4ff-c650286ca8e4',
  posts: 'b96f251e-05d5-44d6-9497-e45985885003',
  messages: 'a33b453f-4350-4f0d-8032-244819775b9e',
};

function getCurrentUserId(): number {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : 1;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}/${endpoint}`;
  const userId = getCurrentUserId();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const charactersApi = {
  getAll: () => apiRequest(ENDPOINTS.characters),
  
  getByUserId: (userId: number) => 
    apiRequest(`${ENDPOINTS.characters}?user_id=${userId}`),
  
  create: (data: {
    name: string;
    race: string;
    class: string;
    description: string;
    avatar?: string;
  }) => apiRequest(ENDPOINTS.characters, {
    method: 'POST',
    body: JSON.stringify({
      user_id: getCurrentUserId(),
      ...data,
    }),
  }),
};

export const locationsApi = {
  getAll: () => apiRequest(ENDPOINTS.locations),
  
  create: (data: {
    name: string;
    type: string;
    description: string;
  }) => apiRequest(ENDPOINTS.locations, {
    method: 'POST',
    body: JSON.stringify({
      user_id: getCurrentUserId(),
      ...data,
    }),
  }),
};

export const postsApi = {
  getAll: () => apiRequest(ENDPOINTS.posts),
  
  create: (data: {
    character_id: number;
    location_id: number;
    content: string;
  }) => apiRequest(ENDPOINTS.posts, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const messagesApi = {
  getByLocation: (locationId: number) => 
    apiRequest(`${ENDPOINTS.messages}?location_id=${locationId}`),
  
  create: (data: {
    character_id: number;
    location_id: number;
    content: string;
  }) => apiRequest(ENDPOINTS.messages, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export { getCurrentUserId };