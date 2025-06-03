<script setup lang="ts">
import { fakeSendSuccess } from '@/lib/fakeSendSucess'
import { IconEye, IconEyeOff, IconLoader2, IconLock, IconMail } from '@tabler/icons-vue'
import { ref } from 'vue'
const isLoading = ref(false)
const isVisiblePassword = ref(false)
const email = ref('')
const pass = ref('')

async function login() {
  isLoading.value = true
  if (email.value !== 'usuario@email.com' || pass.value !== '123456') {
    alert('Usuário ou senha incorreto!')
    isLoading.value = false
    return
  }
  await fakeSendSuccess('Autenticado com sucesso', 3000)
  alert('Autenticado com sucesso')
  isLoading.value = false
  return
  // const response = await fetch('https://jsonplaceholder.org/users')
  // const users = await response.json()
  // console.log(users)
}
</script>

<template>
  <main class="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
    <section
      class="shadow-lg ring-1 ring-black/5 bg-white rounded-lg px-6 py-12 sm:p-12 sm:mx-auto w-full sm:max-w-md"
    >
      <div class="space-y-6">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">E-mail</label>
          <div class="mt-2">
            <div
              class="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-blue-400"
            >
              <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 px-2 sm:px-3">
                <IconMail />
              </div>
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                placeholder="Digite seu e-mail"
                required
                maxlength="255"
                class="block min-w-0 grow py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Senha</label>
            <div class="text-sm">
              <!-- <RouterLink
                  :to="{ name: 'recovery' }"
                  class="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >Esqueceu a senha?</RouterLink
                > -->
            </div>
          </div>
          <div class="mt-2">
            <div
              class="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-blue-400"
            >
              <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 px-2 sm:px-3">
                <IconLock />
              </div>
              <!-- TODO: adicionar logica para visualizar a senha/esconder senha :type="isVisiblePassword ? 'text' : 'password'" -->
              <input
                v-model="pass"
                :type="isVisiblePassword ? 'text' : 'password'"
                name="password"
                id="password"
                autocomplete="current-password"
                placeholder="Digite sua senha"
                required
                maxlength="64"
                class="block min-w-0 grow py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
              <button
                type="button"
                class="shrink-0 text-base text-gray-500 sm:text-sm/6 py-1.5 px-2 sm:px-3"
                id="btn-toggle-is-visible-password"
                @click="isVisiblePassword = !isVisiblePassword"
              >
                <IconEye v-if="isVisiblePassword" id="icon-eye" />
                <IconEyeOff v-else id="icon-eye-off" />
              </button>
            </div>
          </div>
        </div>
        <div class="w-full mt-8">
          <button
            type="submit"
            id="btn-submit"
            class="font-semibold inline-flex items-center justify-center py-1.5 sm:py-1.5 px-3.5 sm:px-4 transition-all duration-200 text-center cursor-pointer bg-green-600 hover:bg-green-500 text-white shadow-xs rounded-md text-sm sm:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 w-full"
            @click="login()"
          >
            <IconLoader2 class="animate-spin" v-if="isLoading" />
            <span v-else>Entrar</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
