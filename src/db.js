const {Client} = require('pg');

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

module.exports = {
    executeSql
}
