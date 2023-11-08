export function isNotEmpty<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined
}

export function isTruthy<T>(v: T | '' | 0 | null | undefined): v is T {
  return Boolean(v)
}

export function toUrl(str: string | URL): URL | null {
  try {
    return new URL(str)
  } catch (e) {
    return null
  }
}

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export function hasProps<T extends object, K extends keyof T>(
  obj: T,
  props: K[],
): obj is WithRequired<T, K> {
  return props.every((p) => p in obj)
}
