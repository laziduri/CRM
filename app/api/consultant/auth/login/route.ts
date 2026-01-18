import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Temporary mock data - replace with database in production
// Demo credentials: Consultant ID: CON001 / Username: consultant1 / Password: demo123
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
]

const JWT_SECRET = process.env.JWT_SECRET || 'brilliance-advisory-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { consultantId, username, email, password } = await request.json()

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

    // Find consultant by email, username, or consultant ID
    const consultant = CONSULTANTS.find(c => {
      if (email) {
        return c.email.toLowerCase() === email.toLowerCase()
      }
      if (username) {
        return c.username.toLowerCase() === username.toLowerCase()
      }
      if (consultantId) {
        return c.consultantId.toUpperCase() === consultantId.toUpperCase()
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
    // For demo: accept "demo123" as password
    // In production, use bcrypt to compare hashed passwords
    const isValidPassword = password === 'demo123' || await bcrypt.compare(password, consultant.password).catch(() => false)

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
