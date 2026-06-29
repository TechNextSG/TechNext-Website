// Vercel Serverless Function — AI Chat via OpenRouter (Kimi 2.5)
// Proxies chat to keep API key server-side
// Protected: Rate limiting (DB-backed) + input validation + origin check

import { neon } from '@neondatabase/serverless'

// ─── Rate Limiter (Neon DB — works across serverless instances) ─────
const RATE_LIMIT_WINDOW_SEC = 60  // 1 minute
const RATE_LIMIT_MAX = 10         // max 10 requests per IP per minute

let tableCreated = false

async function isRateLimited(ip) {
  const sql = neon(process.env.POSTGRES_URL)

  // Create table once per cold start
  if (!tableCreated) {
    await sql`CREATE TABLE IF NOT EXISTS chat_rate_limits (
      ip VARCHAR(45) NOT NULL,
      ts TIMESTAMP DEFAULT NOW()
    )`
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_rate_ip_ts ON chat_rate_limits (ip, ts)`
    tableCreated = true
  }

  // Clean old entries + count recent hits in one round trip
  await sql`DELETE FROM chat_rate_limits WHERE ts < NOW() - INTERVAL '2 minutes'`

  const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM chat_rate_limits WHERE ip = ${ip} AND ts > NOW() - INTERVAL '1 minute'`

  if (count >= RATE_LIMIT_MAX) return true

  // Record this hit
  await sql`INSERT INTO chat_rate_limits (ip) VALUES (${ip})`
  return false
}

// ─── Config ────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 500    // max chars per message
const MAX_MESSAGES = 10           // max messages in conversation
const ALLOWED_ORIGINS = [
  'https://technext.asia',
  'https://www.technext.asia',
  'http://localhost:5173',
  'http://localhost:3000',
]

const SYSTEM_PROMPT = `You are TechNext AI Assistant — a friendly, professional AI representing TechNext (technext.asia), a premium technology company based in Singapore.

About TechNext:
- Full-stack technology company specializing in AI Development, ERP Solutions (Odoo Gold Partner), Web & Mobile Development, Cloud Infrastructure, and Digital Transformation
- Headquartered in Singapore (UEN: 202699888G)
- Serves enterprises across APAC

Your role:
- Answer questions about TechNext services, pricing inquiries, technology stack
- Help visitors understand which services fit their needs
- Be concise, helpful, and professional
- For specific pricing or project discussions, encourage them to use the Contact Form or WhatsApp
- You can speak English and Vietnamese fluently
- Keep responses under 150 words unless asked for detail`

export default async function handler(req, res) {
  // ─── CORS (only allow our domains) ──────────────
  const origin = req.headers.origin || req.headers.referer || ''
  const allowedOrigin = ALLOWED_ORIGINS.find(o => origin.startsWith(o)) || ALLOWED_ORIGINS[0]
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ─── Layer 1: Origin Check ──────────────────
  const isAllowedOrigin = ALLOWED_ORIGINS.some(o => origin.startsWith(o))
  if (!isAllowedOrigin && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // ─── Layer 2: Rate Limiting (DB-backed, distributed) ──────
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown'

  try {
    if (await isRateLimited(clientIP)) {
      return res.status(429).json({
        reply: "You're sending messages too fast! Please wait a moment and try again."
      })
    }
  } catch (err) {
    // If rate limiting fails (DB error), allow the request through
    console.error('Rate limit check failed:', err)
  }

  // ─── Layer 3: Input Validation ──────────────
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: 'Too many messages' })
  }

  // Sanitize: trim, limit length, only allow user/assistant roles
  const sanitized = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role,
      content: String(m.content || '').slice(0, MAX_MESSAGE_LENGTH)
    }))
    .slice(-MAX_MESSAGES)

  if (sanitized.length === 0 || !sanitized.some(m => m.role === 'user')) {
    return res.status(400).json({ error: 'At least one user message required' })
  }

  // ─── API Key Check ─────────────────────────────
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

  if (!OPENROUTER_KEY) {
    return res.status(200).json({
      reply: "Hi! I'm TechNext AI Assistant. I can help you learn about our services: AI Development, ERP Solutions (Odoo), Web & Mobile Development, and Cloud Infrastructure. For detailed inquiries, please use the Contact Form or reach us on WhatsApp!"
    })
  }

  // ─── Call OpenRouter ───────────────────────────
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://technext.asia',
        'X-Title': 'TechNext AI Assistant',
      },
      body: JSON.stringify({
        model: 'moonshotai/kimi-k2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...sanitized,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('OpenRouter error:', data.error)
      return res.status(200).json({
        reply: "I'm having a moment — please try again or reach us on WhatsApp for immediate assistance!"
      })
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again!"

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return res.status(200).json({
      reply: "Something went wrong. Please try WhatsApp or the Contact Form to reach us!"
    })
  }
}
