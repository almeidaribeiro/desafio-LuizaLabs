

const rowsToPayload = (rows) => {
    let product_ids = rows.map(row => row.product_id)
    product_ids = product_ids.filter(id => id !== null)
    const payload = {
        user_id: rows[0].user_id,
        name: rows[0].name,
        email: rows[0].email,
        favorite_products: product_ids
      }
    return payload
}

module.exports = {
    rowsToPayload
}