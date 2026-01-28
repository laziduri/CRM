import { NextResponse } from 'next/server'

/** Stub: meeting transcription – coming soon */
export async function POST() {
  return NextResponse.json(
    { error: 'This feature is coming soon.' },
    { status: 503 }
  )
}
