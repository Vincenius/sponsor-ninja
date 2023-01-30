import React from 'react'
import Head from 'next/head'
import Header from '../Header/Header'
import styles from './Layout.module.css'

const Layout = ({ children, title }) => {
  return  <>
    <Head>
      <title>Sponsor Ninja | {title}</title>
      <meta name="description" content="Todo" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <main className={styles.main}>
      { children }
    </main>
  </>
}

export default Layout
