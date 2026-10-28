# Overskull – Frontend (Vue 3 + Pinia)

Aplicación web para la gestión de productos y categorías. Consume la API REST de [overskull-laravel-api](https://github.com/GeGuMaGu25/overskull-laravel-api).

## Tecnologías

- Vue 3 (Composition API) + Vite
- Pinia (manejo de estado)
- Vue Router
- Tailwind CSS v4
- Axios (con interceptor global de errores)

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Backend corriendo en `http://localhost:8000`

## Instalación y ejecución

```bash
git clone https://github.com/GeGuMaGu25/overskull-vue-frontend.git
cd overskull-vue-frontend
npm install
cp .env.example .env
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api` |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |

## Vistas

| Ruta | Vista |
|---|---|
| `/` | Dashboard con resumen del inventario |
| `/products` | Listado de productos con búsqueda y filtro por categoría |
| `/products/create` | Formulario de creación de producto |
| `/products/:id/edit` | Formulario de edición de producto |
| `/categories` | Listado y gestión de categorías |

## Estructura del proyecto

```
src/
├─ assets/        # Estilos globales (Tailwind)
├─ components/    # Componentes reutilizables (navbar, toasts, modal, spinner...)
├─ views/         # Vistas asociadas a rutas
├─ stores/        # Stores de Pinia (product, category, toast)
├─ router/        # Configuración de Vue Router
├─ services/      # Cliente HTTP (Axios) y servicios por recurso
└─ utils/         # Validaciones, formateadores, manejo de errores y constantes
```

## Manejo de estados y errores

- **Loading:** cada store expone `loading`, `saving` y `deletingId`. Las vistas muestran un spinner y los botones se deshabilitan durante la petición.
- **Éxito:** al crear, actualizar o eliminar se muestra un toast verde con el mensaje que devuelve la API.
- **Error:** un interceptor global de Axios (`src/services/http.js`) normaliza todos los errores a `{ status, message, errors }` y muestra un toast rojo. Cubre:
    - errores de red o API caída
    - tiempo de espera agotado
    - respuestas 4xx (404, 409, 422...)
    - respuestas 5xx
- **Validación:** los formularios se validan en el cliente antes de enviarse (por ejemplo, nombre requerido y precio numérico mayor que 0). Si la API responde 422, los errores se muestran debajo de cada campo.

## Flujo de trabajo Git

El proyecto usa **Git Flow** (`main`, `develop`, `feature/*`, `release/*`) y **Conventional Commits** (`feat`, `fix`, `chore`, `docs`...).