const DEFAULT_MESSAGES = {
    400: 'Solicitud inválida',
    401: 'No autorizado',
    403: 'No tienes permiso para realizar esta acción',
    404: 'El recurso solicitado no existe',
    409: 'Conflicto con el estado actual del recurso',
    422: 'Hay errores en los datos enviados',
    500: 'Error interno en el servidor'
}

export function normalizeError(error) {
    if (error.response) {
        const { status, data } = error.response
        const fallback = status >= 500 ? DEFAULT_MESSAGES[500] : 'Ocurrio un error inesperado'

        return {
            status,
            message: data?.message || DEFAULT_MESSAGES[status] || fallback,
            errors: data?.errors || null
        }
    }

    if (error.code === 'ECONNABORTED') {
        return { status: 0, message: 'La solicitud tardó demasiado. Intentalo nuevamente.' }
    }

    if (error.request) {
        return {
            status: 0,
            message: 'No se puede conectar con el servidor. Verifica tu conexion o que la API esté activa',
            errors: null,
        }
    }

    return { status: -1, message: error.message || 'Ocurrio un error inesperado', errors: null }
}

export function mapValidationErrors(errors) {
    if (!errors) return {}

    return Object.fromEntries(
        Object.entries(errors).map(([field, message]) => [
            field,
            Array.isArray(messages) ? messages[0] : messages,
        ]),
    )
}