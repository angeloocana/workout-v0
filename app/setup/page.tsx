"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Environment Setup Required</CardTitle>
            <CardDescription>Configure these environment variables to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>Add these environment variables to your project:</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-md">
                <code className="text-sm">
                  NEXTAUTH_SECRET=your-secret-key-here
                  <br />
                  NEXTAUTH_URL=http://localhost:3000
                  <br />
                  GOOGLE_CLIENT_ID=your-google-client-id
                  <br />
                  GOOGLE_CLIENT_SECRET=your-google-client-secret
                  <br />
                  OPENAI_API_KEY=your-openai-api-key
                </code>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>To get Google OAuth credentials:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Go to Google Cloud Console</li>
                  <li>Create a new project or select existing</li>
                  <li>Enable Google+ API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add http://localhost:3000/api/auth/callback/google to authorized redirect URIs</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
