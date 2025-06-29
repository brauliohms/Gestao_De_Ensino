// Executado uma única vez antes (setup) e depois (tearDown) da suíte
// inteira de testes

export async function setup() {
  // Roda antes de todos os testes
  // Isso é meio demais, mas às vezes o teste não roda por completo
  // e deixa lixo, como bases de dados antigas ou dados na tabela
  // TODO: criar uma função para limpar o banco de dados ou resetar o estado
  // await cleanupTestDatabase() // Exemplo de função para criar
}

export async function teardown() {
  // Roda depois de todos os testes
  // await cleanupTestDatabase() // Exemplo de função para criar
}
