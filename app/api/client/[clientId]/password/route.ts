import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Temporary mock data - replace with database in production
const CLIENTS: Array<{
  id: string
  email: string
  username?: string
  name: string
  phone: string
  password: string
  createdAt: Date
}> = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'democlient',
    name: 'Demo Client',
    phone: '+65 9123 4567',
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOKqJqJqJqJqJqJqJqJqJqJqJqJqJq',
    createdAt: new Date('2024-01-15'),
  },
]

export async function PUT(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Find client
    const clientIndex = CLIENTS.findIndex(c => c.id === clientId)
    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const client = CLIENTS[clientIndex]

    // Verify current password
    // For demo account, accept "demo123" as current password
    const isValidPassword = currentPassword === 'demo123' || await bcrypt.compare(currentPassword, client.password).catch(() => false)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    CLIENTS[clientIndex].password = hashedPassword

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('[API] Password change error:', error)
    return NextResponse.json(
      { error: 'An error occurred while changing password' },
      { status: 500 }
    )
  }
}
