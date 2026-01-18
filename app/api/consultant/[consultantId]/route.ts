import { NextRequest, NextResponse } from 'next/server'

// Temporary mock data - replace with database in production
// In production, this should share the same data store as the auth routes
const CONSULTANTS: Array<{
  id: string
  consultantId: string
  username: string
  name: string
  email: string
  phone: string
  profilePicture?: string
  role?: string
  director?: string
  createdAt: Date
}> = [
  {
    id: '1',
    consultantId: 'CON001',
    username: 'consultant1',
    name: 'Sarah Chen',
    email: 'sarah.chen@brillianceadvisory.com',
    phone: '+65 9123 4567',
    role: 'Senior Consultant',
    director: 'ashley',
    createdAt: new Date('2024-01-15'),
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { consultantId: string } }
) {
  try {
    const { consultantId } = params

    // Find consultant
    const consultant = CONSULTANTS.find(c => c.id === consultantId)

    if (!consultant) {
      return NextResponse.json(
        { error: 'Consultant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      consultant: {
        id: consultant.id,
        consultantId: consultant.consultantId,
        username: consultant.username,
        name: consultant.name,
        email: consultant.email,
        phone: consultant.phone,
        profilePicture: consultant.profilePicture,
        role: consultant.role,
        director: consultant.director,
      },
    })
  } catch (error) {
    console.error('[API] Consultant fetch error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching consultant data' },
      { status: 500 }
    )
  }
}
