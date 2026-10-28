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
    { label: 'Productos', value: products.length, color: 'text-indigo-600' },
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
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500">Resumen general del inventario</p>
      </div>
      <div class="flex gap-2">
        <RouterLink :to="{ name: 'product-create' }" class="btn-primary">+ Nuevo producto</RouterLink>
        <RouterLink :to="{ name: 'categories' }" class="btn-secondary">Categorías</RouterLink>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" text="Cargando resumen..." />

    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" @retry="loadData" />

    <template v-else>
      <!-- Tarjetas de estadísticas -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="card">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p :class="['mt-2 text-3xl font-bold', stat.color]">{{ stat.value }}</p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <!-- Stock bajo -->
        <div class="card">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            Stock bajo (menos de {{ LOW_STOCK_THRESHOLD }})
          </h2>
          <p v-if="!lowStockProducts.length" class="text-sm text-gray-500">
            Todos los productos tienen stock suficiente.
          </p>
          <ul v-else class="divide-y divide-gray-100">
            <li v-for="product in lowStockProducts" :key="product.id" class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-800">{{ product.name }}</span>
              <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                {{ product.stock }} und.
              </span>
            </li>
          </ul>
        </div>

        <!-- Productos recientes -->
        <div class="card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Productos recientes</h2>
            <RouterLink :to="{ name: 'products' }" class="text-sm text-indigo-600 hover:underline">
              Ver todos
            </RouterLink>
          </div>
          <p v-if="!recentProducts.length" class="text-sm text-gray-500">Aún no hay productos.</p>
          <ul v-else class="divide-y divide-gray-100">
            <li v-for="product in recentProducts" :key="product.id" class="flex items-center justify-between py-2">
              <div>
                <p class="text-sm font-medium text-gray-800">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.category?.name }}</p>
              </div>
              <span class="text-sm font-medium">{{ formatCurrency(product.price) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>