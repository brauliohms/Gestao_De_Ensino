<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
const authStore = useAuthStore()
const toast = useToast()
async function logout() {
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout error:', error)
    toast.error(error instanceof Error ? error.message : 'Erro ao sair')
  }
}
// Optionally, you can redirect to the login page after logout
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Home Page</h1>
    <p>Bem vindo a tela principal</p>
    <button
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="logout()"
    >
      Sair
    </button>
    <p class="mt-4">Usuário: {{ authStore.user?.email }}</p>
  </section>
</template>
