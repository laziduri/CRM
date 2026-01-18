import { NextRequest, NextResponse } from 'next/server'

// Temporary mock data - replace with database in production
const CLIENTS: Array<{
  id: string
  email: string
  username?: string
  name: string
  phone: string
  profilePicture?: string
  password: string
  consultant?: {
    id: string
    name: string
    email: string
  }
  createdAt: Date
}> = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'democlient',
    name: 'Demo Client',
    phone: '+65 9123 4567',
    profilePicture: undefined,
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOKqJqJqJqJqJqJqJqJqJqJqJqJqJq',
    consultant: {
      id: 'c1',
      name: 'Sarah Chen',
      email: 'sarah.chen@brillianceadvisory.com',
    },
    createdAt: new Date('2024-01-15'),
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const clientId = params.clientId

    // Find client
    const client = CLIENTS.find(c => c.id === clientId)

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Return client data (excluding sensitive info)
    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        email: client.email,
        username: client.username,
        name: client.name,
        phone: client.phone,
        profilePicture: client.profilePicture,
        consultant: client.consultant,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching client:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
