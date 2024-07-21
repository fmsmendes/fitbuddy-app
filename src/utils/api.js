export const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data ? JSON.stringify(data) : null,
  });
  return res.json();
};