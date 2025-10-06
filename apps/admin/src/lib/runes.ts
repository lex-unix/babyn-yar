export type Getter<T> = () => T
export type MaybeGetter<T> = T | Getter<T>

export function isFunciton(value: unknown) {
  return typeof value === 'function'
}

export function unpack<T>(value: MaybeGetter<T>) {
  if (isFunciton(value)) return value()
  return value
}
