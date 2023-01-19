import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CircularProgress from '@mui/material/CircularProgress'

import styles from './Onboarding.module.css'

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
  },
});

const CssButtonGroup = styled(ButtonGroup)({
  backgroundColor: '#fff',
});

const Onboarding = () => {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [contribution, setContribution] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const options = [0, 2, 5, 10, 25]
  const contributionAmount = 0.1 * contribution

  const handleSubmit = e => {
    e.preventDefault()
    setIsLoading(true)

    const options = {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        contribution,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch('/api/project', options)
      .then(() => {
        setIsLoading(false)
        router.replace(router.asPath)
      })
      // .catch(err => ) todo
  }

  return <form onSubmit={handleSubmit}>
    <Typography variant="h2" component="h1" gutterBottom>
      Create your first project
    </Typography>

    <CssTextField
      label="Project Name" variant="outlined" fullWidth  color="primary" required
      value={projectName}
      onChange={e => {
        if (e.target.value.length < 64) {
          setProjectName(e.target.value)
        }
      }}
    />

    {/* callback URLS + cors checkbox */}
    {/* https://mui.com/material-ui/react-autocomplete/#multiple-values */}

    <div className={styles.donationContainer}>
      <Typography variant="overline" display="block" gutterBottom>
        Choose how much you want to donate to Sponsor Ninja.
      </Typography>
      <CssButtonGroup size="large">
        {options.map(o =>
          <Button
            key={o}
            variant={o === contribution ? 'contained' : 'outlined'}
            onClick={() => setContribution(o)}
          >
            {o}%
          </Button>
        )}
      </CssButtonGroup>
      <Paper className={styles.info}>
        <InfoOutlinedIcon />
        <div>
          <Typography variant="body2" display="block" gutterBottom>
            For a <b>$10</b> donation you would receive:
          </Typography>
          <Typography variant="body2" display="block">
            First donation each month: $10 - (
              <Tooltip title="Stripe Fee"><span className={styles.tooltip}>$2.025</span></Tooltip><span> + </span>
              <Tooltip title="Sponsor Ninja Donation"><span className={styles.tooltip}>${contributionAmount}</span></Tooltip>)<span> ≈ </span>
              <b>${(10 - contributionAmount - 2.025).toFixed(2)}</b>
          </Typography>
          <Typography variant="body2" display="block" gutterBottom>
            Every other donation: $10 - (
              <Tooltip title="Stripe Fee"><span className={styles.tooltip}>$0.025</span></Tooltip><span> + </span>
              <Tooltip title="Sponsor Ninja Donation"><span className={styles.tooltip}>${contributionAmount}</span></Tooltip>)<span> ≈ </span>
              <b>${(10 - contributionAmount - 0.025).toFixed(2)}</b>
          </Typography>

          <Typography variant="body2" display="block">
            <a href="https://stripe.com/connect/pricing" target="_blank" rel="noopener noreferrer">Read more about the Stripe Fees here</a>
          </Typography>
        </div>
      </Paper>

      <Button fullWidth type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Create Project'}
      </Button>
    </div>
  </form>
}

export default Onboarding
