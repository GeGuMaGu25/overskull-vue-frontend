<script setup>
  defineProps({
    message: { type: String, required: true },
  })

  defineEmits(['retry'])
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-red-800" role="alert">
    <div class="flex items-start gap-3">
      <svg viewBox="0 0 24 24" class="mt-0.5 size-5 shrink-0 text-red-500" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" />
      </svg>
      <p class="text-sm leading-relaxed">{{ message }}</p>
    </div>
    <button type="button" class="btn-secondary px-3 py-1.5" @click="$emit('retry')">Reintentar</button>
  </div>
</template>