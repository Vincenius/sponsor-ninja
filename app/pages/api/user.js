import { withSessionRoute } from '../../lib/withSession'

function userRoute(req, res) {
  res.send({ user: req.session.user })
}

export default withSessionRoute(userRoute)
