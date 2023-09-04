export function isNotEmpty<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined
}

export function toUrl(str: string | URL): URL | null {
  try {
    return new URL(str)
  } catch (e) {
    return null
  }
}
