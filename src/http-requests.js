const axios = require('axios');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const getFavoriteProductsFromApi = async (productIds) => {
    const products = []
    for (let id of productIds) {
        let secs = 500
        let shouldContinue = true
        while (shouldContinue) {
            console.log(`requesting ${id} from API...`)
            await sleep(secs)
            await axios.get(`http://challenge-api.luizalabs.com/api/product/${id}`)
                .then(resp => {
                    products.push(resp.data)
                    shouldContinue = false 
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        shouldContinue = false 
                    } 
                    else {
                        secs = secs + 1000
                        console.log(err, "errror")
                        console.log(`error on request, will retry in ${secs} secs...`)
                    }
                   
                })       
        }
    }
    return products
} 


module.exports = {
    getFavoriteProductsFromApi
}
