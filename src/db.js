const {Client} = require('pg');

const executeSql = async (sql) => {
  const client = new Client();
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
