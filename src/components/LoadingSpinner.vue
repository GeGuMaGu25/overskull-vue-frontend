<script setup>
  defineProps({
    text: { type: String, default: 'Cargando...' },
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12 text-gray-500" role="status">
    <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
    <p class="text-sm">{{ text }}</p>
  </div>
</template>