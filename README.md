# Luiza Labs challenge

Essa é a submissão para o desafio da luiza labs para software engineer. O desafio consiste em implementar uma API que proverá o serviço de backend para uma feature de produtos favoritos que seria utilizado pelo site da Luiza Labs.

Além desse repositório a API também pode ser acessada através desse link:

https://api-luiza.herokuapp.com/


Como um dos requisitos exigidos foi restringir o acesso da API utilizando autenticação, será necessário gerar um token jwt no endpoint `/auth`. Esse token deverá ser enviado no `header` de toda requisiçao da seguinte forma: 

``` 
Authorization: Bearer <token-de-autenticação>
``` 

Abaixo segue um exemplo de como adquirir e utilizar o token.

```
POST /auth

//exemplo de body na requisição:

{
  "admin_name": <admin-name>,
  "password": <password>
}

//exemplo de resposta:
{
  "token": <token-de-autenticação>
}
``` 
Seguindo as boas práticas de segurança o ` <admin-name>` e `<password>` foram enviados por email.

----

## Como rodar a API localmente

Para rodar a aplicação localmente é necessário os seguintes passos:

#### Instalar docker 

Para instalar o Docker siga as instruções do link abaixo:

https://docs.docker.com/get-docker/

#### Rodar Postgres & criar tabelas

Para rodar uma instancia do Postgres execute o seguinte comando docker:

``` 
docker run --rm --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
```
Para criar as tabelas no de banco de dados execute os sequintes comandos:

```
docker cp ./db/createTables.sql postgres:createTables.sql 
docker exec -u postgres postgres psql postgres postgres -f createTables.sql
```

#### Rodar API

Clonar o repositório:

```
git clone https://github.com/almeidaribeiro/desafio-LuizaLabs.git
```
Para rodar a API execute os comandos abaixo: 

 ```
cd desafio-LuizaLabs
 
 docker build . -t luiza-api  
 
docker run --name luiza-api -e ADMIN_NAME=luiza-admin -e PASSWORD=luiza-password -e SECRET=luiza-secret -e PGUSER=postgres -e PGHOST=localhost -e PGPASSWORD=postgres -e PGDATABASE=postgres -e PGPORT=5432 --network=host luiza-api 
 ``` 
 A API estará disponível em 
 http://localhost:5000. 

----

## Como utilizar a API

Todos os exemplos assumem que o o token de autenticação está presente no header da seguinte forma:
```
Authorization: Bearer <token-de-autenticação>
```

```
POST /auth

//exemplo de body na requisição:
{
  "admin_name": "luiza-admin",
  "password": "luiza-password"
}

//exemplo de resposta:
{
  "token": <token-de-autenticação>
}
``` 
O endpoint acima retorna o token necessária para autenticação.

---
```
POST /users

//exemplo do body na requisição:
{
  "name": "user1",
  "email": "user1@gmail.com"
}

// exemplo de resposta:
{
  "id": 1,
  "name": "user1",
  "email": "user1@gmail.com"
}
```
O endpoint acima cria e retorna o novo usuário.

---
```

GET /users

//exemplo de body na requisição:
{ 
    //não é necessário um body.
}

//exemplo de resposta:
[
    {
       "user_id": 1,
       "name": "usuario1",
       "email": "user1@gmail.com",
       "favorite_products": [
           {
            "price": 1000,
            "image": "http://api.com/images.jpg",
            "brand": "marca do produto",
            "id": "12345678901234567890123451",
            "title": "Produto"
        },
        {     
            "price": 1000,
            "image": "http://api.com/images.jpg",
            "brand": "marca do produto",
            "id": "12345678901234567890123452",
            "title": "Produto"
        }     
            ]
     },
     {
       "user_id": 2,
       "name": "usuario2",
       "email": "user2@gmail.com",
       "favorite_products": []
     },
     {
       "user_id": 3,
       "name": "usuario3",
       "email": "user3@gmail.com",
       "favorite_products": []
     }
]
```
O endpoint acima retorna todos os usuários. Se houver produtos adicionados em `favorite_products` retornará as informações desses produtos, se não o campo virá com a lista vazia. 

----
```
GET /user_by_id

//exemplo de body na requisição:
{
    "email": "user1@gmail.com"
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123452",
        "title": "Produto"
    }     
        ]
    }

```
O endpoint acima retorna o usuário que corresponde ao email usado para a consulta. 

----


```
GET /users/:user_id

//exemplo de body na requisição:
{
     //não é necessário um body.
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123452",
        "title": "Produto"
    }     
}

```
O endpoint acima retorna as informações de um usuário.

----

```
PATCH /users/:user_id

//exemplo de body na requisição:
{
	"name": "usuário1111",
	"email": "user1@gmail.com"
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1111",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123452",
        "title": "Produto"
    }     
}
```
O endpoint acima é usado para que se possa atualizar o nome do usuário, porém o email não é possível ser atualizado. 

----

```
DELETE /users/:user_id

//exemplo de body na requisição:
{
    //não é necessário um body.
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1111",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123453",
        "title": "Produto"
    }     
}
```
O endepoint deleta e retorna as informações do usuário. 

----

```
POST /users/:user_id/favorite_products

//exemplo de body na requisição:
{
    "product_id": "12345678901234567890123453"
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1111",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123452",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123453",
        "title": "Produto"
    }      
}
```

O endpoint adiciona um produto novo na lista do usuário. 

----


```
DELETE  /users/:user_id/favorite_products

//exemplo de bodu na requisição:
{
    product_id": "12345678901234567890123453"
}

//exemplo de resposta:
{
    "user_id": 1,
    "name": "usuario1111",
    "email": "user1@gmail.com",
    "favorite_products": [
        {
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123451",
        "title": "Produto"
    },
    {     
        "price": 1000,
        "image": "http://api.com/images.jpg",
        "brand": "marca do produto",
        "id": "12345678901234567890123452",
        "title": "Produto"
    }
```
O endpoint deleta o produto da lista de favoritos de um usuário.

----

#### Considerações finais
Ao executar as requisições, dependendo do números de produtos adicionados poderá haver uma demora, isso ocorre devido ao tempo de pausa que foi adicianado entre as requisções realizadas por essa API para a API de produtos que foi disponibilazada para o desenvolvimento desse desafio. Essa pausa foi necessária pois a API de produtos não permitia múltiplas requisições com intervalos muito curtos entre si. 
