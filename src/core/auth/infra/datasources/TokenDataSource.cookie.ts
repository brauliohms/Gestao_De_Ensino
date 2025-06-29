import type { TokenDataSource } from '../../domain/providers/TokenDataSource.interface'

/**
 * Para que a estratégia de cookie funcione, o backend PRECISA fazer o seguinte:
 *
 * 1. No Endpoint de Login/Refresh: Enviar o cabeçalho Set-Cookie.
 *
 *   Set-Cookie: refreshToken=...seu_token...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Max-Age=...em_segundos...
 *
 *    HttpOnly: Previne acesso via JS (proteção XSS).
 *
 *    Secure: Só envia o cookie sobre HTTPS.
 *
 *    SameSite=Strict: Previne envio em requisições cross-site (proteção CSRF).
 *
 *    Path=/api/auth/refresh: CRÍTICO! Isso garante que o navegador só anexe este cookie a requisições para esse endpoint específico.
 *
 * 2. No Endpoint de Logout: Enviar o cabeçalho Set-Cookie com Max-Age=0.
 *
 * Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Max-Age=0
 *
 * 3. Configuração de CORS: O backend deve responder com Access-Control-Allow-Credentials: true para que o navegador envie os cookies.
 */

export class TokenDataSourceCookie implements TokenDataSource {
  // O backend define o cookie, então o frontend não precisa fazer nada para salvar.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(_refreshToken: string): void {
    console.log('Cookie strategy: save() is a no-op. The server sets the cookie.')
  }

  // O cookie HttpOnly não é acessível por JS, então não podemos lê-lo.
  get(): null {
    console.log('Cookie strategy: get() returns null. The browser handles sending the cookie.')
    return null
  }

  // A remoção real do cookie deve ser feita pelo backend em uma chamada de /logout.
  // Este método existe para cumprir a interface, mas a lógica de remoção está no LogoutUseCase.
  remove(): void {
    console.log(
      'Cookie strategy: remove() is a no-op. The LogoutUseCase must call the logout API endpoint.',
    )
  }

  // Não podemos verificar se o cookie existe, então assumimos que ele *pode* existir.
  // Isso força o auth.guard a sempre tentar uma chamada de refresh se o usuário não estiver no Pinia.
  hasToken(): boolean {
    return true
  }
}
