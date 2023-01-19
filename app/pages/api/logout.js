import { withSessionRoute } from '../../lib/withSession'

function logoutRoute(req, res, session) {
  req.session.destroy();
  res.redirect(303, '/login')
}

export default withSessionRoute(logoutRoute)
