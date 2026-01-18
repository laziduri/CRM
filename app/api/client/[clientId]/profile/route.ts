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
    createdAt: new Date('2024-01-15'),
  },
]

export async function PUT(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params
    const formData = await request.formData()

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const profilePictureFile = formData.get('profilePicture') as File | null

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
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

    // Update client data
    CLIENTS[clientIndex].name = name
    CLIENTS[clientIndex].phone = phone

    // Handle profile picture upload
    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll simulate by storing a placeholder URL
    if (profilePictureFile) {
      // In production: upload file to storage and get URL
      // const uploadedUrl = await uploadToStorage(profilePictureFile)
      // CLIENTS[clientIndex].profilePicture = uploadedUrl
      
      // For demo: use a data URL (not recommended for production)
      // In a real app, you'd convert to blob and upload to storage
      CLIENTS[clientIndex].profilePicture = `/api/avatars/${clientId}?t=${Date.now()}`
    }

    const updatedClient = CLIENTS[clientIndex]

    return NextResponse.json({
      success: true,
      client: {
        id: updatedClient.id,
        email: updatedClient.email,
        username: updatedClient.username,
        name: updatedClient.name,
        phone: updatedClient.phone,
        profilePicture: updatedClient.profilePicture,
      },
    })
  } catch (error) {
    console.error('[API] Profile update error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    )
  }
}
