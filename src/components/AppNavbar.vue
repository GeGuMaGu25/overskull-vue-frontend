<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
]

function isActive(path) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white">
    <nav class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
      <RouterLink to="/" class="text-lg font-bold text-indigo-600">Overskull Admin</RouterLink>

      <ul class="flex gap-1">
        <li v-for="link in links" :key="link.to">
          <RouterLink
              :to="link.to"
              :class="[
              'rounded-lg px-3 py-2 text-sm font-medium transition',
              isActive(link.to) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>