import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Allow demo mode in development
    if (!session && process.env.NODE_ENV !== "development") {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return new Response("OpenAI API key not configured", { status: 500 })
    }

    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are FitBot, an expert AI workout assistant. You help users with:
      - Creating personalized workout plans
      - Exercise form and technique advice
      - Nutrition guidance for fitness goals
      - Motivation and workout tips
      - Injury prevention and recovery advice
      
      Keep responses helpful, encouraging, and focused on fitness and health. Always prioritize safety and recommend consulting professionals for serious health concerns.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
