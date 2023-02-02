// stripe listen --forward-to localhost:3000/api/stripe_webhook
import stripe from 'stripe'
import { buffer } from 'micro'
import db from '../../lib/mongo-helper'

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await db.connectDb()
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
    } catch (err) {
      console.log({ err })
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        await db.updateDonationByQuery({
          query: { payment_id: paymentIntent.id },
          update: { status: 'paid', amount: paymentIntent.amount }
        })

        if (process.env.NOTIFICATION_URL) {
          await fetch(`https://ntfy.sh/${process.env.NOTIFICATION_URL}`, {
            method: 'POST',
            body: `💰 Sponsor Ninja Donation received ${paymentIntent.amount}`
          })
        }

        console.log('successfully updated payment', paymentIntent.id)
        break;
      default:
        // console.log(`Unhandled stripe event type ${event.type}`);
    }

    res.status(200).json()
  }
  await db.disconnectDb()
}
