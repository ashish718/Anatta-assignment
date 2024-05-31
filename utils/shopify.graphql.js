const SHOPIFY_STORE_URL='anatta-test-store.myshopify.com'
const SHOPIFY_ACCESS_TOKEN='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' //6d6dda47f54e5a5ff4e04d4822b4de91

const axios = require('axios')


    module.exports.fetchProduct = async (product_title) => {
        try{
            const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`;

            // GraphQL query to fetch products
            const query = `
            {
            products(first: 10, query: "title:*${product_title}*") {
                edges {
                node {
                    id
                    title
                    variants(first: 100) {
                    edges {
                        node {
                        id
                        title
                        price
                        product {
                            title
                        }
                        }
                    }
                    }
                }
                }
            }
            }
            `;
  
            const response = await fetch(graphqlEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                },
                body: JSON.stringify({ query }),
              });
          
              const data = await response.json();
            return data.data;
            } catch (error) {
              console.error('Error fetching products:', error);
              return error
            }
    
    }

    // fetchProduct('shirt')