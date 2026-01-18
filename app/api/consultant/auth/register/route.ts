import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Temporary mock data - replace with database in production
const CONSULTANTS: Array<{
  id: string
  consultantId: string
  username: string
  password: string
  name: string
  email: string
  phone: string
  director: string
  accessCode: string
  createdAt: Date
}> = []

const ACCESS_CODE = 'BA123456'
const DIRECTORS = ['ashley', 'kenneth', 'lazarus']

const JWT_SECRET = process.env.JWT_SECRET || 'brilliance-advisory-secret-key-change-in-production'

// Generate consultant ID (CON001, CON002, etc.)
const generateConsultantId = () => {
  const nextNumber = CONSULTANTS.length + 1
  return `CON${String(nextNumber).padStart(3, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, phone, password, accessCode, director } = await request.json()

    // Validation
    if (!name || !username || !email || !phone || !password || !accessCode || !director) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate access code
    if (accessCode !== ACCESS_CODE) {
      return NextResponse.json(
        { error: 'Invalid access code. Please contact your administrator.' },
        { status: 403 }
      )
    }

    // Validate director
    if (!DIRECTORS.includes(director.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid director selection' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingConsultantByEmail = CONSULTANTS.find(c => c.email.toLowerCase() === email.toLowerCase())
    if (existingConsultantByEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingConsultantByUsername = CONSULTANTS.find(c => c.username.toLowerCase() === username.toLowerCase())
    if (existingConsultantByUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another one.' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate consultant ID
    const consultantId = generateConsultantId()

    // Create new consultant
    const newConsultant = {
      id: String(CONSULTANTS.length + 1),
      consultantId,
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
      email: email.toLowerCase(),
      phone,
      director: director.toLowerCase(),
      accessCode,
      createdAt: new Date(),
    }

    CONSULTANTS.push(newConsultant)

    // Generate JWT token for auto-login (optional - remove if you want to require email verification first)
    const token = jwt.sign(
      {
        consultantId: newConsultant.id,
        consultantEmployeeId: newConsultant.consultantId,
        email: newConsultant.email,
        role: 'consultant',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success (don't auto-login, let them log in manually)
    return NextResponse.json({
      success: true,
      message: 'Consultant account created successfully! You can now log in.',
      consultantId: newConsultant.id,
      consultant: {
        id: newConsultant.id,
        consultantId: newConsultant.consultantId,
        username: newConsultant.username,
        email: newConsultant.email,
        name: newConsultant.name,
        phone: newConsultant.phone,
        director: newConsultant.director,
      },
    }, {
      status: 201,
    })
  } catch (error) {
    console.error('[API] Consultant registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
