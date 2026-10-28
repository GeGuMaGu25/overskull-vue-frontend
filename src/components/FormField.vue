<script setup>
  defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
  })
</script>

<template>
  <div>
    <label :for="id" class="label">
      {{ label }}
      <span v-if="required" class="text-red-500" aria-hidden="true">*</span>
    </label>
    <slot/>
    <p v-if="error" class="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      <svg viewBox="0 0 16 16" class="size-3.5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5h1.5v4.25h-1.5V4.5Zm0 5.75h1.5v1.5h-1.5v-1.5Z"/></svg>
      {{ error }}
    </p>
  </div>
</template>