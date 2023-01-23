import React, { useEffect } from 'react'
import { CopyBlock, dracula } from "react-code-blocks"
import { SponsorNinja } from '../../public/widget-npm'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import styles from './ProjectCard.module.css'

const getScript = ({ id }) =>
`<script src="https://app.sponsor.ninja/widget.js"></script>
<script>
  SponsorNinja.init({
    id: '${id}',
    target: '#widget-container'
  })
</script>`

const ProjectCard = ({ project }) => {
  useEffect(() => {
      SponsorNinja.init({
        id: project._id,
        target: `#container-${project._id}`
      })
  }, [])

  return <Paper className={styles.container}>
    <div>
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

      {/* TODO options */}
    </div>

    <div>
      <Typography variant="h4" component="h2" gutterBottom>Preview</Typography>
      <div id={`container-${project._id}`}></div>
    </div>
  </Paper>
}

export default ProjectCard
