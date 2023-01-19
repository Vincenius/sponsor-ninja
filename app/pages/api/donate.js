// https://stripe.com/docs/connect/direct-charges
// https://stripe.com/docs/payments/payment-intents
import { ObjectId } from 'mongodb'
import NextCors from 'nextjs-cors'
import StripeLib from 'stripe'
import db from '../../lib/mongo-helper'

const stripe = StripeLib(process.env.STRIPE_SECRET_KEY)

async function donateRoute(req, res) {
  const [project] = await db.getProjectByQuery({ _id: ObjectId(req.query.id) })
  const [user] = await db.getUserByQuery({ _id: ObjectId(project.user_id) })
  // todo error / not found

  let amount = 1000

  if (['5', '10', '25', '50'].includes(req.query.value)) {
    amount = parseInt(req.query.value) * 100 // in cents
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    application_fee_amount: 50,
  }, {
    stripeAccount: user.stripe.stripe_user_id,
  });

  await NextCors(req, res, {
    methods: ['GET'],
    origin: '*', // todo only users domain
    optionsSuccessStatus: 200,
  })

  res.status(200).json({
    client_secret: paymentIntent.client_secret,
    user_public_key: user.stripe.stripe_publishable_key,
    payment_intent_id: paymentIntent.id,
  })
}

export default donateRoute
