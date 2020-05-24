const express = require('express')
const bodyParser = require('body-parser')
const {usersValidator, usersPathValidator, usersEmailValidator} = require('./usersValidator')
const {productsValidator, productsPathValidator} = require('./productsValidator')
const {Client} = require('pg');
const app = express()
const PORT = process.env.PORT || 5000


app.use(bodyParser.json())

app.get('/users', (req, res) => {
   const selectUsers = `
    select 
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p
        on u.user_id=p.user_id 
  `
  
  client.query(selectUsers, (err, dbRes) => {
    if(err) {
      console.error(err);
      res.status(400).send({err, msg:'error on query'})
      return;
    }
    const rows = dbRes.rows
    const user_id = rows[0].user_id
    const name = rows[0].name
    const email = rows[0].email
    const productsId = rows.map(product => product.product_id)
    const payload = {
      user_id: user_id,
      name: name,
      email: email,
      favorite_products: productsId
    }
    console.log(payload)
    res.status(200).send(payload) //ta vindo null e n ta vindo tds os usuarios 
  });  
})

app.get('/user_by_email', usersEmailValidator, (req, res) => { //alterar isso antes de entregar 
  const userEmail =  req.body.email
  console.log(userEmail)
  const selectUser = `
    select
      u.user_id,
      u.name,
      u.email,
      p.product_id
    from users u
      left join favorite_products p 
        on u.user_id=p.user_id
    where u.email='${userEmail}'
  `  
  client.query(selectUser, (err, dbRes) => {
    if(err) {
      console.error(err);
      res.status(400).send({err, msg:'error on query'})
      return;
    }
      const rows = dbRes.rows
      const user_id = rows[0].user_id
      const name = rows[0].name
      const email = rows[0].email
      const productsId = rows.map(product => product.product_id)
      const payload = {
        user_id: user_id,
        name: name,
        email: email,
          favorite_products: productsId
      }
      res.status(200).send(payload)
  }); 
})

app.get('/users/:user_id', usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)  
  const selectUser = ` 
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

  client.query(selectUser, (err, dbRes) => {
    if(err) {
        console.error(err);
        res.status(400).send({err, msg:'error on query'})
        return;
      }
      const rows = dbRes.rows
      const user_id = rows[0].user_id
      const name = rows[0].name
      const email = rows[0].email
      const productsId = rows.map(product => product.product_id)
      const payload = {
        user_id: user_id,
        name: name,
        email: email,
        favorite_products: productsId
      }
      res.status(200).send(payload)
  }); 
})

const executeSql = async (sql) => {
  const client = new Client({
    user: 'boo',
    host: 'localhost',
    database: 'postgres',
    password: 'boodb',
    port: '5432'
  });
  return await client.connect()
    .then(() => client.query(sql))
    .catch(err => {
      client.end()
      throw err
    })
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
      name = '${userName}' and
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

app.post('/users', usersValidator, (req,res) => {
  const userName = req.body.name
  const userEmail = req.body.email
  postUsers(userName, userEmail, res)
})

app.put('/users/:user_id', usersValidator, usersPathValidator, (req, res) => { 
  const userId = parseInt(req.params.user_id)
  const userName = req.body.name
  const userEmail = req.body.email
  const updateUser = `
    update
      users 
        set name='${userName}' email='${userEmail}' 
    where id=${userId}
  `
  // const updateUser = `UPDATE users SET name='${userName}' WHERE user_id=${userId}`

  client.query(updateUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = ({err, msg: 'error on query'})
      res.status(400).send(payload)
      return;
    }
    console.log('New user data insert successful');
    const result = dbRes.rows.map(x => x[0])
    console.log(result)//problema c om o email ele n atualiza mas tb n consigo mandar sem
    const payload = {
      name: req.body.name,
      email: req.body.email
    }
    res.status(200).send(payload)
  }); 
})

app.delete('/users/:user_id', usersPathValidator, (req, res)=> {
  const userId = parseInt(req.params.user_id)
  const deleteUser = `
    delete
    from users 
    where user_id=${userId}
  `

  client.query(deleteUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = ({err, msg: 'error on query'}) 
      res.status(400).send(payload)
      return;
    }
    const payload = {
      user_id:`${userId}`, 
    }
    res.status(200).send(payload)
  });  
})

app.post('/users/:user_id/:favorite_products', productsValidator, productsPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  const product_id = req.body.product_id
  const insertNewProduct = `
    insert
      into favorite_products (user_id, product_id) 
        values (${userId}, '${product_id}')`

  client.query(insertNewProduct, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = ({err, msg: 'error on query'})
      res.status(400).send(payload)
      return;
    }
    const payload = {
      product_id: product_id
    }
    res.status(200).send(payload)
  }); 
})

app.delete('/users/:user_id/:favorite_products', productsPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  const productId = req.body.product_id
  const deleteProduct = `
    delete
    from favorite_products 
    where user_id=${userId} and product_id='${productId}'`

  client.query(deleteProduct, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = ({msg: 'error on query'})
      res.status(400).send(payload)
      return;
    }
    const payload = {
      product_id: `${productId}`
    }
    res.status(200).send(payload)
  })
})

app.listen(PORT, function() {
  console.log("servidor rodando...")
});