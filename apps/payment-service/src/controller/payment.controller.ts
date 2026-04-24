import { AsyncLocalStorage } from "async_hooks";
import { Context } from "hono";
import stripe from "src/utils/stripe";


export const createPaymentIntent = async (c: Context) => {

    const {product}= await c.req.json()

    const totalPrice= await Promise.all(product.map(
        async (item:any)=>{
            const productInDB= await fetch(`localhost:8000/product${product.id}`)

            return productInDB.json.price*product.quantity
        }
    ))

   return c.json({
    success:true,
    message:"Payment Intent Created",
   })

}
    
export const createStripProduct = async (c: Context) => {

    const res= await stripe.products.create({
        id:"123",
        name:"Product 1",
        default_price_data:{
            currency:"usd",
            unit_amount:10*100
        }
    })

return c.json(res)

}

export const getStripeProductById= async(c:Context)=>{
    const {id}= await c.req.param()
    const res= await stripe.products.retrieve(id as string)
    return c.json(res)
}