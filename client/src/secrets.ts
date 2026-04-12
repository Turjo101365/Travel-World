// https://vite.dev/guide/env-and-mode.html
const defaultBackendEndpoint = 'https://travel-world-o473.onrender.com';

const configuredBackendEndpoint =
  import.meta.env.VITE_BACKEND_ENDPOINT ||
  defaultBackendEndpoint;

const backendEndpoint =
  import.meta.env.PROD && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(configuredBackendEndpoint)
    ? defaultBackendEndpoint
    : configuredBackendEndpoint;

export const secrets = {
  backendEndpoint,
};
