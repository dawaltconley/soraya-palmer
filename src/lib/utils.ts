export const toUrl = (str: string | URL): URL | null => {
  try {
    return new URL(str)
  } catch (e) {
    return null
  }
}
