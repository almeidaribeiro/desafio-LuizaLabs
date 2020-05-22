const {Client} = require('pg');

const client = new Client({
    user: 'boo',
    host: 'localhost',
    database: 'postgres',
    password: 'boodb',
    port: '5432'
});

client.connect();
console.log('connected client')

const createTableUsers = `
    CREATE TABLE users (
        id      SERIAL PRIMARY KEY,
        name    text NOT NULL,
        email   text UNIQUE NOT NULL
    );
`;

client.query(createTableUsers)
          .then(res => {
              console.log('Table users is successfully created');
          })
          .catch(err => {
              console.error(err);
          });