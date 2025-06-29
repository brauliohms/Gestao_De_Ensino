// Esta interface define o contrato que qualquer estratégia de armazenamento de token deve seguir.
export interface TokenDataSource {
  /**
   * Salva o refresh token.
   * Na estratégia de cookie HttpOnly, este método pode ser um no-op (operação vazia),
   * pois o cookie é definido pelo cabeçalho de resposta do servidor.
   */
  save(refreshToken: string): void
  /**
   * Obtém o refresh token.
   * Na estratégia de cookie HttpOnly, este método retornará null,
   * pois o token não é acessível via JavaScript.
   */
  get(): string | null
  /**
   * Remove o refresh token.
   * Na estratégia de cookie HttpOnly, isso geralmente é feito
   * realizando uma chamada de API para um endpoint de logout que limpa o cookie.
   */
  remove(): void
  /**
   * Verifica se um token potencialmente existe para que uma tentativa de revalidação seja feita.
   * Para localStorage, isso verifica se a chave existe.
   * Para cookies, isso pode sempre retornar true, forçando a tentativa de refresh,
   * pois não podemos verificar a existência do cookie diretamente.
   */
  hasToken(): boolean
}
