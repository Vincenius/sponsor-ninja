import StripeLib from 'stripe'
import db from '../../lib/mongo-helper'
import { withSessionRoute } from '../../lib/withSession'

const stripe = StripeLib(process.env.STRIPE_SECRET_KEY)

async function loginRoute(req, res) {
  try {
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: req.query.code,
    })

    if (response && response.access_token && response.stripe_user_id) {
      const [user] = await db.getUserByQuery({ 'stripe.stripe_user_id': response.stripe_user_id })

      if (user) {
        await db.updateUserByQuery({
          query: { 'stripe.stripe_user_id': response.stripe_user_id },
          update: { stripe: response },
        })
        const projects = await db.getProjectByQuery({ user_id: user._id.toString() })
        req.session.user = {
          id: user._id.toString(),
          projects,
        }
        await req.session.save()
      } else {
        const newUser = await db.createUser({ stripe: response })
        req.session.user = {
          id: newUser.insertedId.toString(),
        }
        await req.session.save()
      }

      res.redirect(303, '/')
    } else {
      res.redirect(303, '/login?error=true')
    }
  } catch(e) {
    console.log('error on redirect', e)
    res.redirect(303, '/login?error=true')
  }
}

export default withSessionRoute(loginRoute)
