import Head from 'next/head'
import Image from 'next/image'
import Button from '@mui/material/Button'

export default function Login() {
  return (
    <>
      <Head>
        <title>Sponsor Ninja | Login</title>
        <meta name="description" content="Todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Image src="/logo-text.png" alt="Ninja logo" width={300} height={300} style={{ marginBottom: '3em', height: 'auto' }}/>
        <Button variant="contained" href="/api/sign-up">
          Sign-in with Stripe
        </Button>
      </main>
    </>
  )
}
