import React from 'react'
import Layout from '../components/Layout/Layout'
import { withSessionSsr } from "../lib/withSession"
import NewProject from '../components/NewProject/NewProject'
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
    <Layout title="Dashboard">
      { (!user.projects || !user.projects.length) && <NewProject user={user} title="Create your first project" /> }
      { user.projects && user.projects.length && <Dashboard user={user} /> }
    </Layout>
  )
}
