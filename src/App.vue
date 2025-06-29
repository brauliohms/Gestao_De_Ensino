<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.store'

const authStore = useAuthStore()
onMounted(() => authStore.listenForChanges())
</script>

<template>
  <RouterView />
</template>
