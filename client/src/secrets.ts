// https://vite.dev/guide/env-and-mode.html
export const secrets = {
  backendEndpoint:
    import.meta.env.VITE_BACKEND_ENDPOINT ||
    'https://travel-world-o473.onrender.com',
};
