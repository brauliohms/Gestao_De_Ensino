export default interface HttpClient {
  get<T>(url: string): Promise<T>
  post<TIn, TOut>(url: string, data: TIn): Promise<TOut>
  put<TIn, TOut>(url: string, data: TIn): Promise<TOut>
  delete(url: string): Promise<void>
  setAuthorizationHeader(token: string | null): void
}
