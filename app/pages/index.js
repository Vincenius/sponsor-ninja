import Head from 'next/head'

import styles from '../styles/Home.module.css'
import React from 'react'
import { withSessionSsr } from "../lib/withSession"
import Onboarding from '../components/Onboarding/Onboarding'
import Dashboard from '../components/Dashboard/Dashboard'

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user || !user.id) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
);

export default function Home({ user }) {
  return (
    <>
      <Head>
        <title>Sponsor Ninja | Your Projects</title>
        <meta name="description" content="Todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        { !user.projects || !user.projects.length && <Onboarding user={user} /> }
        { user.projects && <Dashboard user={user} />}
      </main>
    </>
  )
}
