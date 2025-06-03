<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <!-- Estrutura padrão do layout da aplicação -->
  <div class="flex min-h-screen min-w-screen bg-gray-50">
    <SideBar />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Conteúdo principal da aplicação -->
      <slot />
    </main>
  </div>
</template>
