import { secrets } from '../secrets';

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const getAppBaseUrl = (): string => {
  try {
    return new URL(secrets.backendEndpoint).origin;
  } catch {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    return '';
  }
};

export const buildAppUrl = (path: string): string => {
  const normalizedPath = normalizePath(path);
  const baseUrl = getAppBaseUrl();

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};
