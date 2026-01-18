import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Demo client fallback (for development/testing)
const DEMO_CLIENT = {
  id: '1',
  email: 'demo@example.com',
  username: 'democlient',
  name: 'Demo Client',
  phone: '+65 9123 4567',
  email_verified: true,
}

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const clientId = params.clientId

    // Check if this is the demo client
    if (clientId === '1') {
      return NextResponse.json({
        success: true,
        client: {
          id: DEMO_CLIENT.id,
          email: DEMO_CLIENT.email,
          username: DEMO_CLIENT.username,
          name: DEMO_CLIENT.name,
          phone: DEMO_CLIENT.phone,
          profilePicture: undefined,
          emailVerified: DEMO_CLIENT.email_verified,
        },
      })
    }

    // Try Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient()

        // Find client in Supabase
        const { data: client, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .maybeSingle()

        if (!error && client) {
          // Return client data (excluding sensitive info like password_hash)
          return NextResponse.json({
            success: true,
            client: {
              id: client.id,
              email: client.email,
              username: client.username,
              name: client.name,
              phone: client.phone || '',
              profilePicture: client.profile_picture,
              emailVerified: client.email_verified,
            },
          })
        }
      } catch (error) {
        console.error('[API] Supabase error:', error)
        // Fall through to not found
      }
    }

    // Client not found
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('[API] Error fetching client:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
