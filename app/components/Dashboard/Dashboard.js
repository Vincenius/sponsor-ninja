import React from 'react'
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import AddBoxIcon from '@mui/icons-material/AddBox'
import ProjectCard from './ProjectCard'
import styles from './Dashboard.module.css'

const Dashboard = ({ user }) => {
  return <div>
    { user.projects.map(project => <div key={project.id}>
        <ProjectCard project={project} />
      </div>
    )}

    <Link href="/projects/new" className={styles.newText}>
      <Paper className={styles.newContainer}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Create New Project
        </Typography>
        <Typography variant="h4" component="p" textAlign="center">
          <AddBoxIcon className={styles.icon} />
        </Typography>
      </Paper>
    </Link>
  </div>
}

export default Dashboard
