const express = require('express')
const bodyParser = require('body-parser')
const {usersValidator, usersPathValidator, usersEmailValidator} = require('./usersValidator')
const {productsValidator, productsPathValidator} = require('./productsValidator')
const {Client} = require('pg');
const app = express()
const PORT = process.env.PORT || 8000

const client = new Client({
  user: 'boo',
  host: 'localhost',
  database: 'postgres',
  password: 'boodb',
  port: '5432'
});

client.connect();
console.log('connected client')

app.use(bodyParser.json())

app.get('/users', (req, res) => {
  const selectUsers = `SELECT * FROM users left join favorite_products on users.user_id=favorite_products.user_id`
  // select * from users left join favorite_products on users.user_id=favorite_products.user_id 
  
  client.query(selectUsers, (err, dbRes) => {
    if(err) {
      console.error(err);
      res.status(400).send({msg:'error on query'})
      return;
    }
    const users = dbRes.rows.map(x => x)
    const payload = JSON.stringify(users)
    res.status(200).send(payload)
  });  
})//tem que retornar a lista de produtos favoritos tb

app.get('/user_by_email', usersEmailValidator, (req, res) => { //alterar isso antes de entregar 
  const userEmail =  req.body
  const selectUser = `SELECT * FROM users WHERE email='${userEmail}'`   

  client.query(selectUser, (err, dbRes) => {
    if(err) {
      console.error(err);
      res.status(400).send({msg:'error on query'})
      return;
    }
    const user = dbRes.rows.map(x => x)
    console.log(user)
    const payload = JSON.stringify(user)
    res.status(200).send(payload) // como retornar a resposta do db?*********
  }); 
})

app.get('/users/:user_id', usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  // const selectUser = `SELECT * FROM users WHERE id = ${userId}`
  const selectUser = `SELECT * FROM users left join favorite_products on users.user_id=favorite_products.user_id WHERE user_id=${userId}`  
  client.query( selectUser, (error, dbRes) => {
    if (error) {
      throw error
    }
      const user = dbRes.rows 
      res.status(200).json(user)
  })
})

app.post('/users', usersValidator, (req,res) => {
  const userName = req.body.name
  const userEmail = req.body.email
  const insertNewUser = `INSERT INTO users (name, email) VALUES  ('${userName}', '${userEmail}')`
 
  client.query(insertNewUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'}
      res.status(400).send(payload)
      return;
    }
    const payload = {
      name: req.body.name,
      email: req.body.email
    }
    res.status(200).send(payload)
  });  
})

app.put('/users/:user_id', usersValidator, usersPathValidator, (req, res) => { 
  const userId = parseInt(req.params.user_id)
  const userName = req.body.name
  // const userEmail = req.body.email
  // const updateUser = `UPDATE users SET name='${userName}' email='${userEmail}' WHERE id=${userId}`
  const updateUser = `UPDATE users SET name='${userName}' WHERE id=${userId}`

  client.query(updateUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'}
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
  const deleteUser = `DELETE FROM users WHERE user_id=${userId}`

  client.query(deleteUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'} 
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
  const insertNewProduct = `INSERT INTO favorite_products (user_id, product_id) VALUES (${userId}, '${product_id}')`

  client.query(insertNewProduct, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'}
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
  const deleteProduct = `DELETE FROM favorite_products WHERE user_id=${userId} and product_id='${productId}'`

  client.query(deleteProduct, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'}
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