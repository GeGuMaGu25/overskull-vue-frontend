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

export function validateProduct(form) {
    const errors = {}
    const name = form.name?.trim() ?? ''

    if (!name) {
        errors.name = 'El campo nombre es requerido'
    } else if (name.length > 150) {
        errors.name = 'El nombre no puede superar los 150 caracteres'
    }

    if (form.description && form.description.length > 1000) {
        errors.description = 'La descripción no puede superar los 1000 caracteres'
    }

    if (form.price === '' || form.price === null || form.price === undefined) {
        errors.price = 'El precio es requerido'
    } else if (Number.isNaN(Number(form.price))) {
        errors.price = 'El precio debe ser numérico'
    } else if (Number(form.price) <= 0) {
        errors.price = 'El precio debe ser mayor que 0'
    }

    if (form.stock === '' || form.stock === null || form.stock === undefined) {
        errors.stock = 'El stock es requerido'
    } else if (!Number.isInteger(Number(form.stock))) {
        errors.stock = 'El stock debe ser un número entero'
    } else if (Number(form.stock) < 0) {
        errors.stock = 'El stock no puede ser negativo'
    }

    if (!form.category_id) {
        errors.category_id = 'Selecciona una categoría'
    }

    return errors
}