// src/app/api/generate-description/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('[SERVER] ✅ Received request to /api/generate-description');

  try {
    const { prompt } = await req.json()
console.log('OpenAI Key:', process.env.OPENAI_API_KEY)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Secure!
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[OpenAI Error]', error)
    return NextResponse.json({ message: 'Failed to generate description' }, { status: 500 })
  }
}
