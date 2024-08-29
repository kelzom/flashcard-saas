import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
let getPromise 
const getStripe = () => {
    if (!StripePromise){
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY )
    }
    return stripePromise
}
export default getStripe
