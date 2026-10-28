<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency } from '@/utils/formatters'
import { LOW_STOCK_THRESHOLD } from '@/utils/constants'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const isLoading = computed(() => productStore.loading || categoryStore.loading)
const errorMessage = computed(() => productStore.error || categoryStore.error)

function loadData() {
  productStore.fetchAll()
  categoryStore.fetchAll()
}

onMounted(loadData)

const stats = computed(() => {
  const products = productStore.products
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return [
    { label: 'Productos', value: products.length, color: 'text-brand-500' },
    { label: 'Categorías', value: categoryStore.categories.length, color: 'text-emerald-600' },
    { label: 'Unidades en stock', value: totalStock, color: 'text-amber-600' },
    { label: 'Valor del inventario', value: formatCurrency(inventoryValue), color: 'text-sky-600' },
  ]
})

const lowStockProducts = computed(() =>
    productStore.products
        .filter((p) => p.stock < LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
)

const recentProducts = computed(() => productStore.products.slice(0, 5))
</script>

<template>
  <section>
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen general del inventario</p>
      </div>
      <div class="flex gap-2">
        <RouterLink :to="{ name: 'product-create' }" class="btn-primary"><svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>
          Nuevo producto</RouterLink>
        <RouterLink :to="{ name: 'categories' }" class="btn-secondary">Categorías</RouterLink>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" text="Cargando resumen..." />

    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" @retry="loadData" />

    <template v-else>
      <!-- Tarjetas de estadísticas -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="card p-5">
          <p class="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-500">
            <span :class="['size-1.5 rounded-full bg-current', stat.color]" aria-hidden="true"></span>
            {{ stat.label }}
          </p>
          <p class="tabular mt-3 truncate text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-ink-900">{{ stat.value }}</p>
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <!-- Stock bajo -->
        <div class="card">
          <h2 class="section-title mb-4">
            Stock bajo
            <span class="ml-1 text-sm font-normal text-ink-500">menos de {{ LOW_STOCK_THRESHOLD }} und.</span>
          </h2>
          <p v-if="!lowStockProducts.length" class="text-sm text-ink-500">
            Todos los productos tienen stock suficiente.
          </p>
          <ul v-else class="divide-y divide-ink-100">
            <li v-for="product in lowStockProducts" :key="product.id" class="flex items-center justify-between gap-4 py-2.5">
              <span class="text-sm text-ink-900">{{ product.name }}</span>
              <span class="badge-low">
                {{ product.stock }} und.
              </span>
            </li>
          </ul>
        </div>

        <!-- Productos recientes -->
        <div class="card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="section-title">Productos recientes</h2>
            <RouterLink :to="{ name: 'products' }" class="link">
              Ver todos
            </RouterLink>
          </div>
          <p v-if="!recentProducts.length" class="text-sm text-ink-500">Aún no hay productos.</p>
          <ul v-else class="divide-y divide-ink-100">
            <li v-for="product in recentProducts" :key="product.id" class="flex items-center justify-between gap-4 py-2.5">
              <div>
                <p class="text-sm font-medium text-ink-900">{{ product.name }}</p>
                <p class="text-xs text-ink-500">{{ product.category?.name }}</p>
              </div>
              <span class="tabular text-sm font-medium text-ink-900">{{ formatCurrency(product.price) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>