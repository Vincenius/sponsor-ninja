import React from 'react'
import { CopyBlock, dracula } from "react-code-blocks"
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import styles from './ProjectCard.module.css'

const getScript = ({ id }) =>
`<script
  src="https://app.sponsor.ninja/widget.min.js"
  id="sponsor-ninja-widget"
  data-id="${id}"
  data-target="#widget-container"
></script>`

const ProjectCard = ({ project }) => {
  return <Paper className={styles.container}>
    <Typography variant="h4" component="h2" gutterBottom>{project.name}</Typography>
    <Typography variant="subtitle1" component="p" gutterBottom>
      Embed the script on your website to start collecting donations.
    </Typography>

    <CopyBlock
      text={getScript({ id: project._id })}
      language="html"
      wrapLines
      theme={dracula}
    />

    {/* Preview */}
  </Paper>
}

export default ProjectCard
