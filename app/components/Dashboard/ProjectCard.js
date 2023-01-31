import React, { useEffect, useState } from 'react'
import { SponsorNinja } from 'sponsor-ninja-widget'
import { CopyBlock, dracula } from "react-code-blocks"
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styles from './ProjectCard.module.css'

const getScript = ({ id }) =>
`<script src="https://app.sponsor.ninja/widget.js"></script>
<script>
  new SponsorNinja({
    id: '${id}',
    target: '#widget-container',
    position: 'top' // default = 'bottom'
  })
</script>`

const getNpmScript = ({ id }) =>
`// npm i sponsor-ninja-widget --save
import { SponsorNinja } from 'sponsor-ninja-widget'

new SponsorNinja({
  id: '${id}',
  target: '#widget-container',
  position: 'top' // default = 'bottom'
})`

const ProjectCard = ({ project }) => {
  const [tab, setTab] = useState(0)
  useEffect(() => {
      new SponsorNinja({
        id: project._id,
        target: `#container-${project._id}`,
        stage: process.env.NEXT_PUBLIC_STAGE,
        position: 'top',
      })
  })

  return <Paper className={styles.container}>
    <div className={styles.topRow}>
      <div>
        <Typography variant="h4" component="h2" gutterBottom>{project.name}</Typography>
        <Typography variant="subtitle1" component="p" gutterBottom>
          Embed the script on your website to start collecting donations.<br/>
          Check the <a href="https://github.com/Vincenius/sponsor-ninja" target="_blank" rel="noopener noreferrer">GitHub repository</a> for a more detailed documentation.
        </Typography>

        <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="fullWidth">
          <Tab label="Via script" />
          <Tab label="Via npm package" />
        </Tabs>
        { tab === 0 && <CopyBlock
          text={getScript({ id: project._id })}
          language="html"
          wrapLines
          theme={dracula}
        /> }
        { tab === 1 && <CopyBlock
          text={getNpmScript({ id: project._id })}
          language="javascript"
          wrapLines
          theme={dracula}
        /> }
      </div>
    </div>

    <div className={styles.bottomRow}>
    <Typography className={styles.previewText} component="span">Preview</Typography>
      <div id={`container-${project._id}`}></div>
    </div>
  </Paper>
}

export default ProjectCard
