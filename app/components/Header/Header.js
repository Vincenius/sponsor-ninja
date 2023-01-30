import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import styles from './Header.module.css'

const Header = ({ showLogout }) => {
  return <header>
      <AppBar position="static" as="nav">
        <Toolbar className={styles.navContainer}>
          <Link href="/">
            <Image src="/logo-text.png" alt="Ninja logo" width={50} height={50} className={styles.logo} />
          </Link>

          { showLogout && <Button color="inherit" href="/api/logout">Logout</Button> }
        </Toolbar>
      </AppBar>
  </header>
}

export default Header
