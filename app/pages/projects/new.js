import React from 'react'

import { withSessionSsr } from "../../lib/withSession"
import Layout from '../../components/Layout/Layout'
import NewProject from '../../components/NewProject/NewProject'

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

const NewPage = ({ user }) => {
  return <Layout title="New Project">
    <NewProject user={user} title="New Project" />
  </Layout>
}

export default NewPage
