/**
 * Utility function to safely extract the origin from a request URL.
 * Falls back to localhost:8081 for development.
 */
export const getRequestOrigin = (request?: { url?: string }): string => {
  if (!request?.url) return 'http://localhost:8081';
  try {
    return new URL(request.url).origin;
  } catch {
    return 'http://localhost:8081';
  }
};

export default getRequestOrigin;
