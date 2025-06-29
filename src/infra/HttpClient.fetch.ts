import type HttpClient from './HttpClient.interface'

export default class FetchAdapter implements HttpClient {
  setAuthorizationHeader(token: string | null): void {
    console.warn('FetchAdapter does not support setting authorization headers.', token)
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return response.json()
  }

  async post<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
    const response = await fetch(url, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  async put<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
    const response = await fetch(url, {
      method: 'put',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  async delete(url: string): Promise<void> {
    await fetch(url, {
      method: 'delete',
    })
  }
}
