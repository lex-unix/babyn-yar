export class ResponseError extends Error {
  status: number
  method: string
  requestUrl: URL
  error: string | Record<string, string>

  constructor(status: number, method: string, requestUrl: string, error: string | Record<string, string>) {
    super(`Request failed with status ${status}: ${method} ${requestUrl}${typeof error === 'string' ? ` - ${error}` : ''}`)
    this.status = status
    this.method = method
    this.requestUrl = new URL(requestUrl)
    this.error = error
  }

  get pathname() {
    return this.requestUrl.pathname
  }

  isUnauthorized(): this is { error: string } {
    return this.status === 401
  }

  isFormError(): this is { error: Record<string, string> } {
    return this.status === 422
  }

  isServerError(): this is { error: string } {
    return this.status >= 500
  }

  isNotFoundError(): this is { error: string } {
    return this.status === 404
  }
}

