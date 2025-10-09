export const debounce = (callback: any, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), wait)
  }
}
