export function trimText(text: string, threshold: number = 50) {
  return text.length < threshold ? text : text.slice(0, threshold) + '...'
}
