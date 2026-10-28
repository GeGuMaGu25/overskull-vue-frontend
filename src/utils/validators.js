export function hasErrors(errors) {
    return Object.keys(errors).length > 0
}

export function validateCategory(form) {
    const errors = {}
    const name = form.name?.trim() ?? ''

    if (!name) {
        errors.name = 'El campo nombre es requerido'
    } else if (name.length > 100) {
        errors.name = 'El nombre no puede superar los 100 caracteres'
    }

    if (form.description && form.description.length > 500) {
        errors.description = 'La descripción no puede superar los 500 caracteres'
    }

    return errors
}