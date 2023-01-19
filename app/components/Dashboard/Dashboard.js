import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ProjectCard from './ProjectCard'

const Dashboard = ({ user }) => {
  return <div>
    { user.projects.map(project =>
      <ProjectCard key={project.id} project={project} />
    )}

    {/* <Paper>
      <Typography variant="h4" component="h2" gutterBottom textAlign="center">
        Create New Project (todo)
      </Typography>
    </Paper> */}
  </div>
}

export default Dashboard
