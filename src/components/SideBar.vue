<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import avatarUrl from '@/assets/images/tabler_avatar_examplo.png'

/**
 * Lista de links do menu lateral
 */
const sidebarLinks = [
  { label: 'Home', to: { path: '/' } },
  { label: 'Usuários', to: { name: 'usuarios' } },
]

// Estado de abertura da sidebar
const isOpen = ref(false)
// Estado reativo para largura da janela
const windowWidth = ref(window.innerWidth)

/**
 * Abre a sidebar (mobile)
 */
function openSidebar() {
  isOpen.value = true
}
/**
 * Fecha a sidebar (mobile)
 */
function closeSidebar() {
  isOpen.value = false
}
/**
 * Atualiza a largura da janela e fecha a sidebar se for desktop
 */
function handleResize() {
  windowWidth.value = window.innerWidth
  // Fecha a sidebar se aumentar para desktop
  if (windowWidth.value >= 768) {
    isOpen.value = false
  }
}

// Adiciona/remover listener de resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <!-- Botão de menu para mobile (canto superior esquerdo) -->
  <button
    class="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded focus:outline-none transition-transform duration-300"
    @click="openSidebar"
    v-if="!isOpen"
    aria-label="Abrir menu"
  >
    <!-- Ícone hambúrguer -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <!-- Sidebar com transição -->
  <transition name="sidebar-slide">
    <aside
      role="complementary"
      v-show="isOpen || windowWidth >= 768"
      :class="[
        'w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4 z-40',
        'md:static md:translate-x-0 md:block',
        isOpen ? 'fixed top-0 left-0 right-0 bottom-0 translate-x-0' : 'fixed -translate-x-full',
        'md:w-64',
        'transition-transform duration-300',
      ]"
      style="max-width: 100vw"
    >
      <!-- Botão de fechar para mobile (canto superior direito) -->
      <button
        class="md:hidden absolute top-4 right-4 text-white z-50 transition-transform duration-300"
        @click="closeSidebar"
        aria-label="Fechar menu"
      >
        <!-- Ícone X -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Topo: Título -->
      <div>
        <div class="text-2xl font-bold text-white mb-6">Gestão de Ensino</div>
        <!-- Menu de navegação -->
        <!-- Componentizar e aplicar v-for e funcao para fundo da pagina selecionada -->
        <nav class="space-y-2">
          <ul class="space-y-1">
            <!-- Renderização dos links do menu -->
            <li v-for="(link, idx) in sidebarLinks" :key="idx">
              <RouterLink :to="link.to" class="block px-4 py-2 rounded hover:bg-gray-700">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Rodapé: User infos -->
      <div class="flex items-center gap-3 p-2 mt-4 border-t border-gray-700 pt-4">
        <!-- TODO: mostrar como criar componente UI Avatar -->
        <img :src="avatarUrl" alt="User avatar" class="w-8 h-8 rounded-full" />
        <div class="flex-1">
          <p class="text-sm font-medium">Aluno João</p>
          <!-- Substituir por um icon de engrenagem depois -->
          <!-- TODO: Adicionar link para configurações e link baseado no NAME -->
          <RouterLink to="#" class="text-xs text-gray-400 hover:text-white">
            Configurações
          </RouterLink>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
/**
 * Estilos responsivos e animação da sidebar
 */
@media (min-width: 768px) {
  aside {
    position: static !important;
    transform: none !important;
    display: flex !important;
  }
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
}
</style>
