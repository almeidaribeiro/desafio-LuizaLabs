const axios = require('axios');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const getFavoriteProductsFromApi = async (productIds) => {
    const products = []
    for (let id of productIds) {
        let secs = 500
        while (true) {
            console.log(`requesting ${id} from API...`)
            try {
                await sleep(secs)
                let resp = await axios.get(`http://challenge-api.luizalabs.com/api/product/${id}`)
                products.push(resp.data)
                break
            }
            catch(err) {
                console.log("error on request, will retry...")
                secs = secs + 1000
            }
        }
        
    }
    return products
}

module.exports = {
    getFavoriteProductsFromApi
}
