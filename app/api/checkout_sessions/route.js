import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  try {
    
    if (!req.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const body = await req.json(); 

    
    if (!body.plan || !body.quantity) {
      throw new Error('Missing required fields: plan, quantity');
    }

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro subscription',
            },
            unit_amount: Math.round(10 * 100), 
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: body.quantity,
        },
      ],
      success_url: 'http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}',
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
