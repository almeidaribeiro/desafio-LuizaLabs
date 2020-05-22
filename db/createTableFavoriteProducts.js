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

const createTableFavoriteProducts = `
    CREATE TABLE favorite_products (
        user_id         INT NOT NULL,
        product_id      VARCHAR(36),
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE (user_id, product_id)
    );
`;

client.query(createTableFavoriteProducts)
        .then(res => {
            console.log('Table favorite_products is successfully created');
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            client.end();
        });