import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import Header from '../Header/Header'
import styles from './Layout.module.css'

const Layout = ({ children, title, showLogout = true }) => {
  const fullTitle = `Sponsor Ninja | ${title}`
  return  <>
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header showLogout={showLogout} />
    <main className={styles.main}>
      { children }
    </main>
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <Typography>© {new Date().getFullYear()} Sponsor Ninja</Typography>
          <Typography>By <a href="https://twitter.com/wweb_dev" target="_blank" rel="noopener noreferrer">@wweb_dev</a></Typography>
        </div>
        <div>
          <Typography><Link href="https://github.com/Vincenius/sponsor-ninja">GitHub</Link></Typography>
          <Typography><Link href="mailto:info@wweb.dev">Email</Link></Typography>
          <Typography><Link href="/terms">Terms & Conditions</Link></Typography>
        </div>
      </div>
    </footer>
  </>
}

export default Layout
