import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { SponsorNinja } from 'sponsor-ninja-widget'
import Layout from '../../components/Layout/Layout'

const ProjectPage = ({ pid = '', project = {} }) => {
  useEffect(() => {
    new SponsorNinja({
      id: pid,
      target: `#container-${pid}`,
      stage: process.env.NEXT_PUBLIC_STAGE,
      position: 'bottom',
    })
  })

  if (!project.name) {
    return <Layout showLogout={false} title="Not Found">
      <Typography variant="h1" component="h2" textAlign="center">
        Project not found
      </Typography>
    </Layout>
  }

  return <Layout showLogout={false} title={project.name}>
    <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
      {project.name}
    </Typography>
    <Typography component="p" textAlign="center" gutterBottom>
      Become a sponsor by donating to this project 👇
    </Typography>
    <Paper style={{ marginBottom: '50vh', padding: '1em' }}>
      <div id={`container-${pid}`}></div>
    </Paper>
  </Layout>
}

export async function getServerSideProps(context) {
  const { pid = '123' } = context.params
  let project = {}
  try {
  project = await fetch(`http://localhost:3000/api/project?id=${pid}`)
    .then(res => res.json())
  } catch (err) { }

  return {
    props: { pid, project }, // will be passed to the page component as props
  }
}

export default ProjectPage
