import { NextRequest, NextResponse } from 'next/server'
import { getKnowledgeBase, retrieveRelevantChunks } from '@/lib/rag'
import { KnowledgeChunk } from '@/lib/kb'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '6591234567'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  threadId?: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
}

const SYSTEM_PROMPT = `You are Claire, the AI Assistant for Brilliance Advisory (Singapore).

SCOPE:
- You ONLY handle LOANS in Singapore (personal loans and business loans)
- Do NOT mention grants at all
- If asked about grants, politely redirect: "I specialize in loans. For grants, please contact our team directly."

PERSONALITY & TONE:
- Friendly, calm, professional, human
- Speak simple English, Singapore-friendly tone
- Mirror user's language style - if they use "ah", "lah", "can", respond naturally but don't overdo it
- Never sound robotic or legalistic
- Reassure users, reduce anxiety

CORE RULES:
1. Ask ONE question at a time - NEVER ask multiple questions in one message
2. Use short sentences - keep responses concise and easy to read
3. ALWAYS explain why you ask questions: "I ask this because..." or "This helps me..." or "Different banks assess differently, so..."
4. Never guarantee approval, rates, or outcomes - always say "subject to bank assessment"
5. Always offer a clear next step at the end
6. Use natural conversation flow - don't force buttons, but guide naturally

BEHAVIOUR RULES:
- Detect intent: browsing (casual questions) vs high intent (ready to apply, needs specific info)
- Remember short-term context - don't repeat questions already asked
- If user asks about documents, rates, approval, or speed → guide toward human handoff
- When intent is high (wants to apply, needs specific rates, asks about approval), offer WhatsApp or booking
- For browsing questions, answer helpfully and see if they need more
- Mirror user language: if they say "how much can i borrow ah", respond with "Got it 🙂 roughly how much are you looking at?"

COMPLIANCE:
- All information is general and subject to bank assessment
- No financial guarantees
- Never promise specific rates or approval

CONVERSATION FLOW:
- Answer questions directly and simply
- If you need more info, ask ONE follow-up question with explanation
- When user shows high intent, naturally guide: "For personalized advice, would you like to speak with our advisor? They can give you specific rates and help with your application."
- Don't be pushy - let the conversation flow naturally

INTENT DETECTION:
- Browsing: User is exploring, educate and provide information
- Comparing: User wants to compare options, show advantages of working with you
- Ready to apply: User is ready, trigger human handoff immediately
- Just curious: User is learning, provide helpful information

MEMORY/CONTEXT:
- Remember what user already shared (employment type, loan amount, etc.)
- Don't repeat questions already asked
- Reference previous answers: "Since you're self-employed..." or "Based on the $30k you mentioned..."

SOFT QUALIFICATION:
- NEVER say "You are not eligible" or "You cannot qualify"
- Instead say: "There may still be options — let me explain" or "Different banks assess differently, so there might be alternatives"
- Always offer hope and next steps

CONFIDENCE WITHOUT GUARANTEES:
- Use this tone: "Based on what you shared, this usually works well — final approval depends on bank assessment."
- Be confident but safe: "There are usually a few options available" not "You will definitely get approved"
- Always end with: "Final approval depends on the bank's assessment"

EXAMPLE GOOD RESPONSES:
- "Got it 🙂 roughly how much are you looking at? (I ask this because different banks have different limits, so it helps me give you a more realistic guide.)"
- "What best describes your income? (Different banks assess differently, so this helps me point you in the right direction.)"
- "Since you're self-employed, banks usually look at your business income and bank statements instead of just payslips."
- "Based on what you shared, there are usually a few options available 😊 Final approval depends on the bank's assessment, but this looks workable."

Respond like a helpful, friendly colleague who knows about loans in Singapore.`

// GET handler for connection testing
export async function GET() {
  console.log('[API] GET /api/chat called')
  return NextResponse.json({ 
    ok: true, 
    route: '/api/chat',
    message: 'Chat API route is available',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  console.log('[API] POST /api/chat called')
  
  try {
    // Check API key - if missing, use fallback responses
    if (!OPENAI_API_KEY) {
      console.warn('[API] OPENAI_API_KEY is not set - using fallback responses')
      
      // Parse request to get user message
      let body: ChatRequest
      try {
        body = await request.json()
      } catch (jsonError) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
      }

      const { messages } = body
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
      }

      const lastMessage = messages[messages.length - 1]
      if (!lastMessage || lastMessage.role !== 'user') {
        return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
      }

      const userQuery = lastMessage.content.toLowerCase()
      const isFirstMessage = messages.length === 1 // Only the user's first message

      // Simple fallback responses - Singapore-friendly, conversational, one question at a time
      // With soft qualification and confidence without guarantees
      let fallbackResponse = ""
      let shouldHandoff = false
      
      // Detect high intent keywords (triggers handoff)
      const highIntentKeywords = ['apply', 'approval', 'approve', 'documents', 'doc', 'speed', 'fast', 'urgent', 'need now', 'how long', 'how fast']
      const hasHighIntent = highIntentKeywords.some(keyword => userQuery.includes(keyword))
      
      // Detect intent type
      const isComparing = userQuery.includes('compare') || userQuery.includes('difference') || userQuery.includes('which is better') || userQuery.includes('vs')
      const isReady = hasHighIntent || userQuery.includes('ready') || userQuery.includes('want to get')
      const isCurious = userQuery.includes('just wondering') || userQuery.includes('curious') || userQuery.includes('learning')
      
      if (userQuery.includes('grant')) {
        fallbackResponse = "I specialize in loans here. For grants, please contact our team directly via WhatsApp - they can help you with that."
        shouldHandoff = true
      } else if (userQuery.includes('personal loan') || userQuery.includes('personal financing')) {
        if (isReady || hasHighIntent) {
          fallbackResponse = "For personal loans, basic requirements are: 21-65 years old, minimum income around $2,000-$3,000, and Singapore citizenship/PR/valid work pass. Loan amounts usually range from 4-8 times your monthly salary, subject to bank assessment.\n\nFor specific rates and approval details, our advisors can give you personalized advice. Would you like to speak with them?"
          shouldHandoff = true
        } else if (isComparing) {
          fallbackResponse = "Personal loans in Singapore vary by bank. Some advantages of working with us: we help you find the best fit based on your profile, not just the lowest rate. We also guide you through the application to improve approval chances.\n\nWhat would you like to compare?"
        } else {
          fallbackResponse = "For personal loans in Singapore, you typically need to be 21-65 years old with minimum monthly income around $2,000-$3,000. Loan amounts can range from 4-8 times your monthly salary, depending on the bank and your profile.\n\nWhat would you like to know more about?"
        }
      } else if (userQuery.includes('business loan') || userQuery.includes('business financing') || userQuery.includes('corporate loan')) {
        if (isReady || hasHighIntent) {
          fallbackResponse = "Business loans include term loans, working capital loans, trade financing, and more. Generally, you need ACRA registration and 6 months to 2 years of operations, plus financial statements.\n\nFor specific rates and eligibility, our advisors can assess your situation. Want to speak with them?"
          shouldHandoff = true
        } else if (isComparing) {
          fallbackResponse = "Different business loan types serve different needs. Term loans for fixed amounts, working capital for daily operations, trade financing for import/export. We help you understand which fits your situation best.\n\nWhat type of business financing are you considering?"
        } else {
          fallbackResponse = "Business loans in Singapore come in different types - term loans, working capital loans, trade financing, equipment financing, and lines of credit. Each serves different needs.\n\nWhat type of business financing are you looking for?"
        }
      } else if (userQuery.includes('interest rate') || userQuery.includes('rate') || userQuery.includes('apr')) {
        fallbackResponse = "Rates vary by loan type and lender. Personal loans typically range from 3.5% to 10% per annum, business loans from 4% to 12% per annum. The actual rate depends on your credit profile, loan amount, and the bank's assessment.\n\nFor specific rates based on your profile, our advisors can help. Would you like to speak with them?"
        shouldHandoff = true
      } else if (userQuery.includes('eligibility') || userQuery.includes('qualify') || userQuery.includes('requirements') || userQuery.includes('not eligible') || userQuery.includes('cannot qualify') || userQuery.includes('rejected')) {
        // Soft qualification - never reject, always offer hope
        if (userQuery.includes('not eligible') || userQuery.includes('cannot qualify') || userQuery.includes('rejected') || userQuery.includes('reject')) {
          fallbackResponse = "There may still be options — let me explain. Different banks have different criteria, and sometimes it's about finding the right fit or improving your application.\n\nWhat situation are you facing? Our advisors can help explore alternatives."
          shouldHandoff = true
        } else {
          fallbackResponse = "Requirements depend on the loan type. Personal loans need age 21-65 and minimum income. Business loans need ACRA registration and operational history.\n\nAre you looking at personal or business loans?"
        }
      } else if (userQuery.includes('cost') || userQuery.includes('fee') || userQuery.includes('price')) {
        fallbackResponse = "Our service is free for you. We work on commission from banks when you successfully get a loan through us. No upfront costs, and it doesn't affect your loan terms or rates.\n\nWhat else would you like to know?"
      } else if (userQuery.includes('how to') || userQuery.includes('how do i') || userQuery.includes('process') || userQuery.includes('apply')) {
        fallbackResponse = "The process is simple. We'll discuss your needs, assess your situation, and guide you through the application. We help with everything from assessment to documentation.\n\nAre you ready to start, or do you have questions first?"
        shouldHandoff = true
      } else if (userQuery.includes('how much') || userQuery.includes('borrow') || userQuery.includes('loan amount') || userQuery.includes('amount')) {
        // Handle loan amount questions
        if (userQuery.includes('personal') || !userQuery.includes('business')) {
          fallbackResponse = "For personal loans, the amount you can borrow usually ranges from 4-8 times your monthly salary, depending on the bank and your credit profile. Most banks have minimums around $1,000 and maximums up to $200,000 or more.\n\nWhat's your monthly income? This helps me give you a more realistic estimate."
        } else {
          fallbackResponse = "Business loan amounts vary widely - from $50,000 to several million, depending on your business profile, revenue, and the loan type. Working capital loans are typically 1-3 months of revenue, while term loans can be larger.\n\nWhat type of business financing are you looking for?"
        }
      } else if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('hey')) {
        // Only send full greeting if it's the very first message
        if (isFirstMessage) {
          fallbackResponse = "Hi! I'm Claire. I can help you with personal and business loans in Singapore. What would you like to know?"
        } else {
          // Already in conversation, just acknowledge briefly
          fallbackResponse = "Hi! How can I help you with your loan questions?"
        }
      } else if (userQuery.includes('what is brilliance') || userQuery.includes('who is brilliance') || userQuery.includes('about brilliance')) {
        fallbackResponse = "We're a Singapore-based consultancy that helps with personal and business loans. Unlike automated platforms, we work directly with you to understand your situation and guide you through the process.\n\nWhat can I help you with today?"
      } else {
        // More helpful default - try to understand what they're asking
        if (userQuery.length < 10) {
          // Very short query, might be unclear
          fallbackResponse = "Could you tell me more about what you're looking for? I can help with personal loans, business loans, eligibility, rates, and the application process."
        } else {
          // Generic but more helpful response
          fallbackResponse = "I can help with personal loans, business loans, eligibility, rates, and the application process. What specific question do you have?"
        }
      }

      return NextResponse.json({
        message: fallbackResponse,
        citations: [],
        shouldForceHandoff: shouldHandoff,
        whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I'd like to speak with a consultant about: ${lastMessage.content}`)}`,
      })
    }

    // Validate and parse JSON
    let body: ChatRequest
    try {
      body = await request.json()
      console.log('[API] Request body parsed:', JSON.stringify(body, null, 2))
    } catch (jsonError) {
      console.error('[API] Invalid JSON in request body:', jsonError)
      const errorResponse = {
        error: 'Invalid JSON in request body',
        details: jsonError instanceof Error ? jsonError.message : 'Failed to parse JSON'
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { messages, threadId } = body

    // Strict validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const errorResponse = {
        error: 'Messages are required',
        details: 'The request must include a non-empty messages array'
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      const errorResponse = {
        error: 'Last message must be from user',
        details: 'The last message in the messages array must have role "user"'
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const userQuery = lastMessage.content

    // Retrieve relevant chunks
    let knowledgeBase: KnowledgeChunk[] = []
    try {
      knowledgeBase = getKnowledgeBase()
    } catch (kbError) {
      console.error('[API] Error loading knowledge base:', kbError)
      // Continue without knowledge base - bot will still work but won't have context
    }
    
    const relevantChunks = retrieveRelevantChunks(userQuery, knowledgeBase, 5, 0.1)

    // Build context from retrieved chunks
    const contextChunks = relevantChunks.map((chunk, idx) => 
      `[${idx + 1}] ${chunk.text}\nSource: ${chunk.title || chunk.source}${chunk.sourceUrl ? ` (${chunk.sourceUrl})` : ''}`
    ).join('\n\n')

    const contextSection = contextChunks 
      ? `\n\nRELEVANT CONTEXT:\n${contextChunks}\n\nUse ONLY information from the context above.`
      : '\n\nNO RELEVANT CONTEXT FOUND. You must refuse to answer and offer WhatsApp handoff + appointment booking.'

    // Build conversation history
    const conversationHistory: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + contextSection },
      ...messages.map(msg => ({ role: msg.role, content: msg.content })),
    ]

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] OpenAI API error:', response.status, errorText)
      
      let errorMessage = 'Failed to generate response'
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.error?.message) {
          errorMessage = `OpenAI API error: ${errorData.error.message}`
        }
      } catch {
        // If parsing fails, use the text as is
        if (errorText) {
          errorMessage = `API error: ${errorText.slice(0, 200)}`
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status >= 400 && response.status < 500 ? response.status : 500 }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

    // Extract citations from response
    const citations: Array<{ title: string; url?: string }> = []
    const citationRegex = /\[Source: ([^\]]+)\]\(([^)]+)\)/g
    let match
    while ((match = citationRegex.exec(assistantMessage)) !== null) {
      citations.push({
        title: match[1],
        url: match[2],
      })
    }

    // If no citations and we have chunks, add them
    if (citations.length === 0 && relevantChunks.length > 0) {
      for (const chunk of relevantChunks) {
        if (chunk.sourceUrl) {
          citations.push({
            title: chunk.title || chunk.source,
            url: chunk.sourceUrl,
          })
        }
      }
    }

    // Check if we should force handoff (no relevant chunks found)
    const shouldForceHandoff = relevantChunks.length === 0 || 
      (relevantChunks.length > 0 && relevantChunks[0].similarity < 0.2)

    return NextResponse.json({
      message: assistantMessage,
      citations,
      shouldForceHandoff,
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I'd like to speak with a consultant about: ${userQuery}`)}`,
    })
  } catch (error) {
    console.error('[API] Chat API error:', error)
    if (error instanceof Error) {
      console.error('[API] Error stack:', error.stack)
      console.error('[API] Error message:', error.message)
      return NextResponse.json(
        { error: `Internal server error: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error: Unknown error occurred' },
      { status: 500 }
    )
  }
}
