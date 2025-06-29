// import { vi } from 'vitest'

// // Mock global do vue-router
// vi.mock('vue-router', async () => {
//   const actual = await vi.importActual('vue-router')
//   return {
//     ...actual,
//     createRouter: vi.fn(() => ({
//       push: vi.fn(),
//       currentRoute: { value: { name: 'login' } },
//       beforeEach: vi.fn(),
//       afterEach: vi.fn(),
//       install: vi.fn(),
//     })),
//     createWebHistory: vi.fn(),
//     useRouter: () => ({
//       push: vi.fn(),
//     }),
//     useRoute: () => ({
//       name: 'login',
//     }),
//   }
// })

// // Mock global do vue-toastification
// vi.mock('vue-toastification', () => ({
//   useToast: () => ({
//     error: vi.fn(),
//     success: vi.fn(),
//   }),
// }))
