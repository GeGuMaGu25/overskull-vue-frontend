<script setup>
  defineProps({
    message: { type: String, required: true },
  })

  defineEmits(['retry'])
</script>

<template>
  <div class="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
    <p class="text-sm">{{ message }}</p>
    <button type="button" class="btn-danger px-3 py-1.5" @click="$emit('retry')">Reintentar</button>
  </div>
</template>