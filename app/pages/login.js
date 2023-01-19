import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
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
      <main className={styles.main}>
        <Image src="/logo.png" alt="Ninja logo" width={300} height={300} style={{ marginBottom: '3em' }}/>
        <Button variant="outlined" href="/api/sign-up">
          Sign-in with Stripe
        </Button>
      </main>
    </>
  )
}
