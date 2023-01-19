export const ironOptions = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.SESSION_PW,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

