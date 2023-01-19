export default async function handler(req, res) {
  const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.STRIPE_REDIRECT_URL}`

  res.redirect(303, url)
}
