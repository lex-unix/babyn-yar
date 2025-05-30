export class ResponseError extends Error {
  status: number
  method: string
  requestUrl: URL
  error: string | Record<string, string>
  formErrors: Record<string, string>

  constructor(opts: {
    status: number
    method: string
    url: string
    error: string | Record<string, string>
  }) {
    const { status, method, url, error } = opts
    super(
      `Request failed with status ${status}: ${method} ${url}${typeof error === 'string' ? ` - ${error}` : ''}`
    )
    this.status = status
    this.method = method
    this.requestUrl = new URL(url)
    this.error = error
    this.formErrors = error as Record<string, string>
  }

  get pathname() {
    return this.requestUrl.pathname
  }

  isUnauthorized(): this is { error: string } {
    return this.status === 401
  }

  isFormError(): this is { formErrors: Record<string, string> } {
    return this.status === 422
  }

  isServerError(): this is { error: string } {
    return this.status >= 500
  }

  isNotFoundError(): this is { error: string } {
    return this.status === 404
  }
}
