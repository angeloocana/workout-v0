export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}

// Check if required environment variables are set
export function validateEnv() {
  const required = ["NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "OPENAI_API_KEY"]
  const missing = required.filter((key) => !env[key as keyof typeof env])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
    return false
  }
  return true
}
