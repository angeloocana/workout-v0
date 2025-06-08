"use client"

import { useChat } from "ai/react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      // Check if we're in development mode and allow demo access
      if (process.env.NODE_ENV === "development") {
        setIsDemoMode(true)
      } else {
        router.push("/login")
      }
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session && !isDemoMode) {
    return null
  }

  const user = session?.user || { name: "Demo User", image: null }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">FB</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">FitBot</h1>
          {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Demo Mode</span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          {session ? (
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to FitBot!</h2>
            <p className="text-gray-600">
              I'm your AI workout assistant. Ask me about exercises, workout plans, nutrition, or any fitness-related
              questions!
            </p>
            {isDemoMode && (
              <p className="text-sm text-yellow-600 mt-2">You're in demo mode. Some features may be limited.</p>
            )}
          </Card>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md xl:max-w-lg ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.role === "user" ? (
                  <>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white">FB</AvatarFallback>
                )}
              </Avatar>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">FB</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about workouts, exercises, nutrition..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
