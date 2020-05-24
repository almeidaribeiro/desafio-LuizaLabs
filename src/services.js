const {executeSql} = require('./db');
const {rowsToPayload} = require('./formatter')

const getUsers = async (res) => {
  const selectUsersSql = `
    select 
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id=p.user_id
  `

  const dbResp = await executeSql(selectUsersSql)

  const rows = dbResp.rows

  const user_ids = rows.map(x => x.user_id)
  const user_ids_set = new Set(user_ids)
  const user_ids_unique = [...user_ids_set]
  let payload = {}
  for (let id of user_ids_unique) {
    payload[id] = {
      user_id: id,
      name: null,
      email: null,
      favorite_products: [],
    }
  }

  for (let row of rows) {
    let user_id = row.user_id
    payload[user_id].name = row.name
    payload[user_id].email = row.email
    if (row.product_id !== null) {
      payload[user_id].favorite_products.push(row.product_id)
    }
  }

  payload = Object.values(payload)

  res.send(payload)
}

const getUserByEmail = async (userEmail, res) => {
  const selectUserSql = `
    select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id = p.user_id
    where
      u.email='${userEmail}'
  ` 

  const dbResp = await executeSql(selectUserSql)
  const rows = dbResp.rows

  if (rows.length === 0) {
    const payload = {
      "msg": "User with given email not found"
    }
    res.status(404).send(payload)
    return
  }

  const payload = rowsToPayload(rows)
  res.send(payload)
}

const getUserById = async (userId, res) => {
  const selectUserSql = ` 
    select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id=p.user_id
    where u.user_id=${userId}
  `  

  const dbResp = await executeSql(selectUserSql)
  const rows = dbResp.rows
  if (rows.length === 0) {
    const payload = {
      "msg": "User not found"
    }
    res.status(404).send(payload)
    return
  }

  const payload = rowsToPayload(rows)
  res.send(payload)

}

const postUsers = async (userName, userEmail, res) => {
  const insertUserSql = `
    insert 
      into
      users (name, email) 
      values('${userName}', '${userEmail}')
  `
  const selectUserSql = `
    select
      user_id,
      name,
      email
    from
      users
    where
      email = '${userEmail}'
  `
  let dbResp = await executeSql(selectUserSql)
  if (dbResp.rows.length !== 0) {
    res.status(400).send({"msg": "User email already exists"})
    return
  }

  await executeSql(insertUserSql)
  dbResp = await executeSql(selectUserSql)

  const payload = {
    id: dbResp.rows[0].user_id,
    name: dbResp.rows[0].name,
    email: dbResp.rows[0].email
  }
  res.status(200).send(payload)
}

const patchUsers = async (userId, userName, res) => {
  const updateUserSql = `
    update users 
    set name='${userName}'
    where user_id=${userId}
  `
  const selectUserSql = `
    select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id = p.user_id
    where
      u.user_id = ${userId}
  `

  await executeSql(updateUserSql)
  const dbResp = await executeSql(selectUserSql)
  const rows = dbResp.rows
  const payload = rowsToPayload(rows)
  res.send(payload)
}

const deleteUsers = async (userId, res) => {
  const selectUserSql = `
      select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id = p.user_id
    where
      u.user_id = ${userId}
  `
  const deleteUserSql = `
    delete
    from users 
    where user_id=${userId}
  `

  const dbResp = await executeSql(selectUserSql)
  const rows = dbResp.rows
  if (rows.length === 0) {
    const payload = {
      "msg": "User not found"
    }
    res.status(404).send(payload)
    return
  }

  await executeSql(deleteUserSql)
  const payload = rowsToPayload(rows)
  res.send(payload)
}

const postFavoriteProducts = async (userId, productId, res) => {
  const insertProductSql = `
    insert into favorite_products (user_id, product_id) 
      values (${userId}, '${productId}')
  `
  const selectUserSql = `
      select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id = p.user_id
    where
      u.user_id = ${userId}
  `
  let dbResp = await executeSql(selectUserSql)
  const rows = dbResp.rows
  if (rows.length === 0) {
    const payload = {
      "msg": "User not found"
    }
    res.status(404).send(payload)
    return
  }
  
  const payloadOld = rowsToPayload(dbResp.rows)
  if (payloadOld.favorite_products.includes(productId)) {
    const payload = {
      "msg": "Product already added"
    }
    res.status(400).send(payload)
    return
  }

  await executeSql(insertProductSql)

  dbResp = await executeSql(selectUserSql)
  const payloadNew = rowsToPayload(dbResp.rows)
  res.send(payloadNew)

}

const deleteFavoriteProducts = async (userId, productId, res) => {
  const selectUserSql = `
      select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id = p.user_id
    where
      u.user_id = ${userId}
  `
  
  const deleteProductSql = `
    delete
    from favorite_products 
    where user_id=${userId} and product_id='${productId}'
  `  

  const dbResp = await executeSql(selectUserSql)
  const rowsOld = dbResp.rows
  if (rowsOld.length === 0) {
    const payload = {
      "msg": 'User not found'
    }
    res.status(404).send(payload)
    return
  }
  const payloadOld = rowsToPayload(rowsOld)
  if (!payloadOld.favorite_products.includes(productId)) {
    const payload = {
      "msg": 'Product not found'
    }
    res.status(404).send(payload)
    return
  }

  await executeSql(deleteProductSql)
  const dbRespNew = await executeSql(selectUserSql)
  const payloadNew = rowsToPayload(dbRespNew.rows)

  res.send(payloadNew)  
}

module.exports = {
    getUsers,
    getUserByEmail,
    getUserById,
    postUsers,
    patchUsers,
    deleteUsers,
    postFavoriteProducts,
    deleteFavoriteProducts
}
