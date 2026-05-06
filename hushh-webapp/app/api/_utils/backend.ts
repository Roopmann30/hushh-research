
/**
 * Single source of truth for backend traffic.
 * Optimized for resilience with build-time safety to ensure CI validation passes.
 */
export function getPythonApiUrl(): string {
  return process.env.PYTHON_API_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";
}

export function getDeveloperApiUrl(): string {
  return process.env.DEVELOPER_API_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";
}

/**
 * PR 2: High-efficiency request handler with exponential backoff and timeout.
 */
export async function proxyWithRetry(
  path: string,
  options: RequestInit & { timeout?: number; retries?: number } = {}
): Promise<Response> {
  const baseUrl = getPythonApiUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const { timeout = 8000, retries = 3, ...fetchOptions } = options;

  let lastError: unknown;

  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Return immediately on success or client errors (400-404)
      if (response.ok || (response.status < 500 && response.status !== 429)) {
        return response;
      }

      // Exponential backoff: 1s, 2s, 4s
      await new Promise((res) => setTimeout(res, Math.pow(2, i) * 1000));
      
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err;

      if (err instanceof Error && err.name === "AbortError" && i < retries - 1) {
        await new Promise((res) => setTimeout(res, Math.pow(2, i) * 1000));
        continue;
      }
      
      if (i === retries - 1) break;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Request failed at ${path}`);
}