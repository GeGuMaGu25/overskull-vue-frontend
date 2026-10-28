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
  <header class="sticky top-0 z-30 border-b border-ink-200/80 bg-white/85 backdrop-blur-md backdrop-saturate-150">
    <nav class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
      <RouterLink to="/" class="group flex items-center gap-2.5 rounded-lg">
        <span class="grid size-8 place-items-center rounded-lg bg-ink-900 text-white shadow-sm transition-transform duration-200 group-active:scale-95">
          <svg viewBox="0 0 24 24" class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3c-4.4 0-8 3.1-8 7.2 0 2.3 1.1 4.3 2.9 5.6V19a1 1 0 0 0 1 1h8.2a1 1 0 0 0 1-1v-3.2c1.8-1.3 2.9-3.3 2.9-5.6C20 6.1 16.4 3 12 3Z" />
            <circle cx="9" cy="11" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="15" cy="11" r="1.6" fill="currentColor" stroke="none" />
            <path d="M10.5 20v-2.5M13.5 20v-2.5" />
          </svg>
        </span>
        <span class="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
          Overskull <span class="font-normal text-ink-500">Admin</span>
        </span>
      </RouterLink>

      <ul class="flex gap-0.5 rounded-xl bg-ink-100 p-1">
        <li v-for="link in links" :key="link.to">
          <RouterLink
              :to="link.to"
              :class="[
              'block rounded-lg px-3 py-1.5 text-sm font-medium transition-[color,background-color,box-shadow] duration-150',
              isActive(link.to)
                ? 'bg-white text-ink-900 shadow-[0_1px_2px_oklch(20%_0.02_285/0.08),0_0_0_1px_oklch(20%_0.02_285/0.04)]'
                : 'text-ink-500 hover:text-ink-900',
            ]"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>