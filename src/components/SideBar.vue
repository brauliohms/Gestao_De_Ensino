<script setup lang="ts">
import avatarUrl from '@/assets/images/tabler_avatar_examplo.png'
</script>
<template>
  <aside class="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
    <!-- Topo: Logo -->
    <div>
      <div class="text-2xl font-bold text-white mb-6">Gestão de Ensino</div>

      <!-- Menu de navegação -->
      <nav class="space-y-2">
        <ul class="space-y-1">
          <!-- Links de exemplo -->
          <li>
            <RouterLink to="/" class="block px-4 py-2 rounded hover:bg-gray-700"> Home </RouterLink>
          </li>
          <li>
            <RouterLink to="/home" class="block px-4 py-2 rounded hover:bg-gray-700">
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/home" class="block px-4 py-2 rounded hover:bg-gray-700">
              Home
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Rodapé: User infos -->
    <div class="flex items-center gap-3 p-2 mt-4 border-t border-gray-700 pt-4">
      <img :src="avatarUrl" alt="User avatar" class="w-8 h-8 rounded-full" />
      <div class="flex-1">
        <p class="text-sm font-medium">Aluno João</p>

        <!-- Substituir por um icon de engrenagem depois -->
        <RouterLink to="#" class="text-xs text-gray-400 hover:text-white">
          Configurações
        </RouterLink>
      </div>
    </div>
  </aside>
</template>
