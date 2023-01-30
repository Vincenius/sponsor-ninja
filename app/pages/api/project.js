import NextCors from 'nextjs-cors'
import { ObjectId } from 'mongodb'
import db from '../../lib/mongo-helper'
import { withSessionRoute } from '../../lib/withSession'

const createProject = async (req, res) => {
  const { name, contribution = 0 } = req.body

  if (!name) {
    res.status(500).send()
  } else {
    await db.createProject({
      user_id: req.session.user.id,
      name,
      contribution,
    })
    const allProjects = await db.getProjectByQuery({ user_id: req.session.user.id })

    req.session.user = {
      ...req.session.user,
      projects: allProjects,
    }
    await req.session.save()

    if (process.env.NOTIFICATION_URL) {
      fetch(`https://ntfy.sh/${process.env.NOTIFICATION_URL}`, {
        method: 'POST',
        body: `Sponsor Ninja Project: ${name}`
      })
    }

    res.status(201).send()
  }
}

const getProject = async (req, res) => {
  const [project] = await db.getProjectByQuery({ _id: ObjectId(req.query.id) })

  if (!project) {
    res.status(404).send()
  } else {
      // get user based on project.user_id and use project urls for cors

      await NextCors(req, res, {
        methods: ['GET'],
        origin: '*', // todo only users domain
        optionsSuccessStatus: 200,
      })
      const donations = await db.getDonationByQuery({ $and: [{ project_id: ObjectId(req.query.id) }, { status: 'paid' }] })

      res.status(200).json({
        name: project.name,
        donations: donations.map(d => ({
          ...d.data,
          amount: d.amount,
        })),
      })
  }
}

async function projectRoute(req, res) {
  await db.connectDb()
  if (req.method === 'GET' && req.query.id) {
    await getProject(req, res)
  } else if (!req.session.user) {
    res.status(401).send()
  } else {
    if (req.method === 'POST') {
      await createProject(req, res)
    } else if (req.method === 'PUT') {
      res.status(404).send() // todo
    } else {
      res.status(404).send()
    }
  }
  await db.disconnectDb()
}

export default withSessionRoute(projectRoute)
