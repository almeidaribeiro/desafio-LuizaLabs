const axios = require('axios');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const favs = ['c60ba2af-6b1c-f932-8dd3-42a7d17a54db', '4bd442b1-4a7d-2475-be97-a7b22a08a024', '571fa8cc-2ee7-5ab4-b388-06d55fd8ab2f']

async function getProducts (ids) {
    const favoriteProducts = []
    for (let id of ids) {
        await sleep(3000)
        let result = axios.get(`http://challenge-api.luizalabs.com/api/product/${id}`).then(resp => resp.data).catch(err => err)
        favoriteProducts.push(result)
    }
    return favoriteProducts
}

getProducts(favs).then(favoriteProducts =>
    Promise.all(favoriteProducts).then(ids => console.log(ids)).catch(err => err)
)
