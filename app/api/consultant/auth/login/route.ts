import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Temporary mock data - replace with database in production
// Demo: CON001 / consultant1 / demo123  |  Clean account: CON002 / clean / clean123
// In production, this should share the same data store as the register route
const CONSULTANTS: Array<{
  id: string
  consultantId: string
  username: string
  password: string
  name: string
  email: string
  phone: string
  director?: string
  createdAt: Date
}> = [
  {
    id: '1',
    consultantId: 'CON001',
    username: 'consultant1',
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOKqJqJqJqJqJqJqJqJqJqJqJqJqJq', // hashed "demo123"
    name: 'Sarah Chen',
    email: 'sarah.chen@brillianceadvisory.com',
    phone: '+65 9123 4567',
    director: 'ashley',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    consultantId: 'CON002',
    username: 'clean',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // hashed "clean123"
    name: 'Clean Account',
    email: 'clean@brillianceadvisory.com',
    phone: '+65 9000 0000',
    director: 'ashley',
    createdAt: new Date(),
  },
]

const JWT_SECRET = process.env.JWT_SECRET || 'brilliance-advisory-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    const consultantId = typeof body.consultantId === 'string' ? body.consultantId.trim() : ''
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Accept email, username, or consultantId for login
    if (!email && !username && !consultantId) {
      return NextResponse.json(
        { error: 'Email, username, or consultant ID is required' },
        { status: 400 }
      )
    }

    // Find consultant by email, username, or consultant ID (try all provided values)
    const consultant = CONSULTANTS.find(c => {
      if (email && c.email.toLowerCase() === email.toLowerCase()) return true
      if (username && c.username.toLowerCase() === username.toLowerCase()) return true
      if (consultantId) {
        // Match consultant ID (CON001) or username if user put username in ID field
        return c.consultantId.toUpperCase() === consultantId.toUpperCase() ||
          c.username.toLowerCase() === consultantId.toLowerCase()
      }
      return false
    })

    if (!consultant) {
      return NextResponse.json(
        { error: 'Invalid email, username, consultant ID, or password' },
        { status: 401 }
      )
    }

    // Verify password
    // For demo: accept "demo123" / "clean123" or bcrypt match
    // In production, use bcrypt to compare hashed passwords
    const demoPasswords = (consultant.consultantId === 'CON001' && password === 'demo123') ||
      (consultant.consultantId === 'CON002' && password === 'clean123')
    const isValidPassword = demoPasswords || await bcrypt.compare(password, consultant.password).catch(() => false)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email, username, consultant ID, or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        consultantId: consultant.id,
        consultantEmployeeId: consultant.consultantId,
        email: consultant.email,
        role: 'consultant',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success with token
    return NextResponse.json({
      success: true,
      token,
      consultantId: consultant.id,
      consultant: {
        id: consultant.id,
        consultantId: consultant.consultantId,
        username: consultant.username,
        email: consultant.email,
        name: consultant.name,
        phone: consultant.phone,
        director: consultant.director,
      },
    })
  } catch (error) {
    console.error('[API] Consultant login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
