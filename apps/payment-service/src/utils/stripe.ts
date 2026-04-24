import Stripe from "stripe";

const stripe= new Stripe(process.env.STRIPE_SECRETKEY as string,{
    apiVersion: "2026-03-25.dahlia" as any
})

export default stripe