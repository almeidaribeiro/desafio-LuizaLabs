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
        UNIQUE (user_id, product_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE      
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