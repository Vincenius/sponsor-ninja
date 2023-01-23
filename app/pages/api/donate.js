// https://stripe.com/docs/connect/direct-charges
// https://stripe.com/docs/payments/payment-intents
import { ObjectId } from 'mongodb'
import NextCors from 'nextjs-cors'
import StripeLib from 'stripe'
import db from '../../lib/mongo-helper'

const stripe = StripeLib(process.env.STRIPE_SECRET_KEY)

const getLink = async (req, res, project, user) => {
  let amount = 1000

  if (['5', '10', '25', '50'].includes(req.query.value)) {
    amount = parseInt(req.query.value) * 100 // in cents
  }

  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const donations = await db.getDonationByQuery({ $and: [{ project_id: project._id }, { status: 'paid' }, { "created_at": { $gte : firstDay } }] })
  const transactionFee = donations.length ? 0 : 200 // https://stripe.com/en-de/connect/pricing
  const applicationFee = (amount / 100) * project.contribution
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    application_fee_amount: applicationFee + transactionFee,
  }, {
    stripeAccount: user.stripe.stripe_user_id,
  });

  res.status(200).json({
    client_secret: paymentIntent.client_secret,
    user_public_key: user.stripe.stripe_publishable_key,
    payment_intent_id: paymentIntent.id,
  })
}

const submitDonation = async (req, res, project, user) => {
  const { data = {}, payment_id } = req.body


  const newDonation = {
    project_id: project._id,
    payment_id,
    created_at: new Date(),
    status: 'pending',
    data,
  }

  await db.createDonation(newDonation)

  res.status(200).json({ ok: true })
}

async function donateRoute(req, res) {
  const [project] = await db.getProjectByQuery({ _id: ObjectId(req.query.id) })
  const [user] = await db.getUserByQuery({ _id: ObjectId(project.user_id) })

  await NextCors(req, res, {
    methods: ['GET', 'POST'],
    origin: '*', // todo only users domain setting
    optionsSuccessStatus: 200,
  })

  if (req.method === 'GET' && req.query.id && project && user) {
    return getLink(req, res, project, user)
  } else if (req.method === 'POST' && project && user) {
    return submitDonation(req, res, project, user)
  } else {
    res.status(404).send()
  }
}

export default donateRoute
