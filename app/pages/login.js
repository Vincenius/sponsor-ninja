import Button from '@mui/material/Button'
import Image from 'next/image'
import Layout from '../components/Layout/Layout'

export default function Login() {
  return (
    <Layout title="Login" showLogout={false}>
      <Image src="/logo-text.png" alt="Ninja logo" width={300} height={300} style={{ marginBottom: '3em', height: 'auto' }}/>
      <Button variant="contained" href="/api/sign-up">
        Sign-in with Stripe
      </Button>
    </Layout>
  )
}
