# Gestão de Ensino

Projeto Frontend em VueJS 3 - Gestão de Ensino

## Para iniciar projeto

É necessário tem instalado o [NodeJs] (<https://nodejs.org/pt>) com o npm

Após baixar esse repositório:

1- Instale as dependências (instrução abaixo).

2- Execute o servidor de desenvolvimento para projeto iniciar em `http://localhost:5173/` (instrução abaixo).

### Instalando as dependências

```sh
npm install
```

### Iniciar o servidor de desenvolvimento

```sh
npm run dev
```

### Type-Check, Compile e Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
