const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
})

export function formatCurrency(value) {
    return currencyFormatter.format(Number(value) || 0)
}