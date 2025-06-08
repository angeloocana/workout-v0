"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const authError = searchParams.get("error")

  useEffect(() => {
    if (authError) {
      switch (authError) {
        case "Configuration":
          setError("Authentication service is not properly configured. Please check environment variables.")
          break
        case "AccessDenied":
          setError("Access was denied. Please try again.")
          break
        case "Verification":
          setError("Verification failed. Please try again.")
          break
        default:
          setError("Authentication failed. Please try again.")
      }
    }
  }, [authError])

  useEffect(() => {
    getSession()
      .then((session) => {
        if (session) {
          router.push("/chat")
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        setLoading(false)
        setError("Failed to check authentication status.")
      })
  }, [router])

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      setIsSigningIn(true)

      await signIn("google", {
        callbackUrl: "/chat",
        redirect: true,
      })
    } catch (err) {
      setError("Failed to sign in. Please check your configuration and try again.")
      setIsSigningIn(false)
    }
  }

  const handleDemoMode = () => {
    // For development/demo purposes - bypass auth
    if (process.env.NODE_ENV === "development") {
      router.push("/chat")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to FitBot</CardTitle>
          <CardDescription>Your AI-powered workout assistant. Sign in to start your fitness journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleGoogleSignIn} className="w-full" size="lg" disabled={isSigningIn}>
            {isSigningIn ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">G</span>
                </div>
                Continue with Google
              </div>
            )}
          </Button>

          {/* Development mode bypass */}
          {process.env.NODE_ENV === "development" && (
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Development Mode</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleDemoMode} className="w-full">
                Continue without Auth (Demo)
              </Button>
              <div className="text-xs text-gray-500 text-center">
                <p>Missing environment variables? Use demo mode to test the chat interface.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
