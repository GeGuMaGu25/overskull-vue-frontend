<script setup>
  defineProps({
    text: { type: String, default: 'Cargando...' },
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16 text-ink-500" role="status">
    <div class="size-7 animate-spin rounded-full border-[2.5px] border-ink-200 border-t-brand-600 [animation-duration:650ms]"></div>
    <p class="text-sm">{{ text }}</p>
  </div>
</template>