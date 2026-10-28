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
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot/>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>