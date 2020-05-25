# Favorite Products API

Simple API for to save records about favorite products of a user.

## Getting Started 

These instructions will  help you a run the project.

### Prerequisites

- Clone the repository:

Clone with HTTPS
```bash 
https://github.com/almeidaribeiro/desafio-LuizaLabs.git
``` 
or 

Clone with SSH

```bash
git@github.com:almeidaribeiro/desafio-LuizaLabs.git
``` 

- Install Docker 

- Run Postgres on Docker 
```bash 
docker run --rm   --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data  postgres

```
- Execute the command for run the project 
 ```bash
docker run --name luiza-api -e ADMIN_NAME=<name> -e PASSWORD=<password> -e SECRET=<secret> -e PGUSER=<postgres user> -e PGHOST=<localhost> -e PGPASSWORD=<postgres passsword> -e PGDATABASE=<postgres> -e PGPORT=<postgres port> --network=host luiza-api 
 ``` 

 - The project run on the localhost:5000

## Resources 


### Authenticate

This API is secured by JWT and the authentication endpoint lives under /auth/.

`ADMIN_NAME=ADMIN_NAME` 

`PASSWORD=PASSWORD` 


***POST***

  http://localhost:5000/auth

Body: 
```JSON
{
  "admin_name": "ADMIN_NAME",
  "password": "PASSWORD"
}
``` 
All requests need to have the Authorization header set.

**Ex:**
```bash
Authorization: Bearer Token 

TOKEN: <token>

Prefix: Bearer
``` 
## Users

- ### Create a new user: 

***POST***    

http://localhost:5000/users

Body:

```JSON
{
    "name": "string",
	"email": "string"
}
```


- ### Can get all users: 

***GET***

http://localhost:5000/users

Body: 

```JSON
No need a body.
```


- ### Find a user by email (for get your ID):

***GET***

http://localhost:5000/user_by_email

Body: 

```JSON
{
"email": "string"
}
```

- ### Find a user by ID:

***GET***

Need to pass a ID in a path.

http://localhost:5000/users/:user_id

Body:

```JSON
No need a body.
```
- ### Update a user 

***PATCH***

Need to pass a ID in a path.

http://localhost:5000/users/:user_id

Body:

```JSON
{
	"name": "string",
	"email": "string"
}
```

- ### Delete a user 

***DELETE***

Need to pass a ID in a path.

http://localhost:5000/users/:user_id

Body:

```JSON
No need a body.
```

## Favorite Products 

- ### Add a new product on the list

***POST***

Need to pass a ID in a path.

http://localhost:5000/users/:user_id/favorite_products

Body: 

```JSON
{
	"product_id": "string: pass the product id"
}
```
- ### Delete a product of the list

***DELETE***

Need to pass a ID in a path.

http://localhost:5000/users/:user_id/favorite_products

Body:

```JSON
{
	"product_id": "string:pass the product id
"
}
```
