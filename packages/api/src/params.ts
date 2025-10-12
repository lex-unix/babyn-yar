export function toSearchParams(
  obj: Record<string, string | number | undefined | null>
) {
  const def = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)])
  return new URLSearchParams(def)
}
