const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 8000;

const {fetchProduct}  = require('./utils/shopify.graphql')

// middlewares
app.use(cors());
app.use(express.json());



var args = process.argv;

if (args.includes('-name')) {
    let argValue = args.indexOf('-name')
    fetchProductByArg(args[argValue+1])
}else{
    console.log("argument required -name value or use API http://localhost:8000/product?title=value")
}

//call search product function at the time of run app
async function fetchProductByArg (title){
    const searchProduct = await fetchProduct(title)

    if (searchProduct.products.edges.length > 0) {
        
        const variants_data = await simplifiedData(searchProduct.products.edges)

        console.log(variants_data, "final output data")
    }else{
        console.log("no product found with name" + title)
    }

}



//API to search product http://localhost:8000/product?title=test
app.get("/product", async (req, res) => {
    if (!req.query.title) {
        return res.status(422).json({message: "product title is required for filter"})
    }

    const searchProduct = await fetchProduct(req.query.title)

    if (searchProduct.products.edges.length > 0) {
        
        const variants_data = await simplifiedData(searchProduct.products.edges)

        return res.status(200).json({success: true, message: "product found", data: variants_data})
    }
    
    return res.status(200).json({success: true, message: "no result found.", data: null})
});

//simplified the products data, if available 
async function simplifiedData(product_data){
    let variants_data = []

    product_data.map(data=>{
        variants_data = variants_data.concat(data.node.variants.edges)
    })

    if (variants_data.length > 0) {
        variants_data.sort(function(a, b) {
            return parseFloat(a.node.price) - parseFloat(b.node.price);
        });    

        let final_output = variants_data.map(data => {
            return `${data.node.product.title} - variant ${data.node.title} - price ${data.node.price}`
        })

        return final_output;
    }
    else{
        return variants_data
    }
}






process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection at ', promise, `reason: ${err.message}`)
  process.exit(1)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});