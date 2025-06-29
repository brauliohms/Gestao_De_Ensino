import type { TokenDataSource } from '../../domain/providers/TokenDataSource.interface'
import { TokenDataSourceCookie } from './TokenDataSource.cookie'
import { TokenDataSourceLocalStorage } from './TokenDataSource.localstorage'

export class TokenDataSourceFactory {
  static create(storageStrategy: 'cookie' | 'localstorage' = 'localstorage'): TokenDataSource {
    switch (storageStrategy) {
      case 'cookie':
        return new TokenDataSourceCookie()
      case 'localstorage':
        return new TokenDataSourceLocalStorage()
      default:
        throw new Error(`Unsupported storage strategy: ${storageStrategy}`)
    }
  }
}
