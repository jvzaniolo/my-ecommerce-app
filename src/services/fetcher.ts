export const fetcher = <T>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<T> => fetch(input, init).then(res => res.json())
