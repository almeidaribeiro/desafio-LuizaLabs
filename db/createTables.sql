CREATE TABLE users (
    user_id      SERIAL PRIMARY KEY,
    name    text NOT NULL,
    email   text UNIQUE NOT NULL
);

CREATE TABLE favorite_products (
    user_id         INT NOT NULL,
    product_id      VARCHAR(36),
    UNIQUE (user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE      
);