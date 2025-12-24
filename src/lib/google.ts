import { google } from "googleapis"

export function getDriveClient(refreshToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  auth.setCredentials({ refresh_token: refreshToken })

  return google.drive({ version: "v3", auth })
}
