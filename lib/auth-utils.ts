import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { createHash } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'brilliance-advisory-secret-key-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'brilliance-advisory-refresh-secret-key-change-in-production'

export interface TokenPayload {
  clientId: string
  email: string
  sessionId?: string
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function getClientIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null
    return decoded?.clientId || null
  } catch (error) {
    return null
  }
}

export function extractDeviceInfo(request: NextRequest): {
  userAgent: string
  ipAddress: string
  deviceFingerprint: string
} {
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const ipAddress = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'Unknown'
  const acceptLanguage = request.headers.get('accept-language') || ''
  
  // Create device fingerprint
  const fingerprintData = `${userAgent}|${acceptLanguage}`
  const deviceFingerprint = createHash('sha256')
    .update(fingerprintData)
    .digest('hex')
    .substring(0, 32)
  
  return {
    userAgent,
    ipAddress,
    deviceFingerprint,
  }
}

export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  }
}
