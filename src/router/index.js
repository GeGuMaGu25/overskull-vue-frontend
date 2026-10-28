import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' },
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('@/views/ProductListView.vue'),
        meta: { title: 'Productos' },
    },
    {
        path: '/products/create',
        name: 'product-create',
        component: () => import('@/views/ProductFormView.vue'),
        meta: { title: 'Nuevo producto' },
    },
    {
        path: '/products/:id/edit',
        name: 'product-edit',
        component: () => import('@/views/ProductFormView.vue'),
        props: true,
        meta: { title: 'Editar producto' },
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/CategoryListView.vue'),
        meta: { title: 'Categorías' },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.afterEach((to) => {
    document.title = `${to.meta.title ?? 'Inicio'} | Overskull`
})

export default router