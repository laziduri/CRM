import { randomBytes, createHash } from 'crypto'

export interface Session {
  sessionId: string
  clientId: string
  deviceId: string
  deviceInfo: string
  userAgent: string
  ipAddress: string
  location?: string
  createdAt: Date
  lastActivityAt: Date
  expiresAt: Date
  refreshToken: string
  isActive: boolean
}

export interface DeviceInfo {
  deviceId: string
  deviceFingerprint: string
  deviceInfo: string
  userAgent: string
  platform: string
  browser: string
}

// In-memory session store (use database in production)
const SESSIONS: Map<string, Session> = new Map()
const DEVICE_SESSIONS: Map<string, string[]> = new Map() // deviceId -> sessionIds[]

// Session expiry: 7 days for access token, 30 days for refresh token
const ACCESS_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days

export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateDeviceFingerprint(userAgent: string, acceptLanguage: string = ''): string {
  const data = `${userAgent}|${acceptLanguage}|${Date.now()}`
  return createHash('sha256').update(data).digest('hex').substring(0, 32)
}

export function parseDeviceInfo(userAgent: string): { platform: string; browser: string; deviceInfo: string } {
  let platform = 'Unknown'
  let browser = 'Unknown'
  
  // Detect platform
  if (userAgent.includes('Windows')) platform = 'Windows'
  else if (userAgent.includes('Mac')) platform = 'macOS'
  else if (userAgent.includes('Linux')) platform = 'Linux'
  else if (userAgent.includes('Android')) platform = 'Android'
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) platform = 'iOS'
  
  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
  else if (userAgent.includes('Edg')) browser = 'Edge'
  
  const deviceInfo = `${platform} • ${browser}`
  
  return { platform, browser, deviceInfo }
}

export function createSession(
  clientId: string,
  deviceId: string,
  deviceInfo: string,
  userAgent: string,
  ipAddress: string,
  location?: string
): Session {
  const sessionId = generateSessionId()
  const refreshToken = generateRefreshToken()
  const now = new Date()
  
  const session: Session = {
    sessionId,
    clientId,
    deviceId,
    deviceInfo,
    userAgent,
    ipAddress,
    location,
    createdAt: now,
    lastActivityAt: now,
    expiresAt: new Date(now.getTime() + ACCESS_TOKEN_EXPIRY),
    refreshToken,
    isActive: true,
  }
  
  SESSIONS.set(sessionId, session)
  
  // Track sessions per device
  const deviceSessions = DEVICE_SESSIONS.get(deviceId) || []
  deviceSessions.push(sessionId)
  DEVICE_SESSIONS.set(deviceId, deviceSessions)
  
  return session
}

export function getSession(sessionId: string): Session | undefined {
  const session = SESSIONS.get(sessionId)
  if (!session || !session.isActive) return undefined
  
  // Check if session expired
  if (new Date() > session.expiresAt) {
    invalidateSession(sessionId)
    return undefined
  }
  
  // Update last activity
  session.lastActivityAt = new Date()
  return session
}

export function getSessionByRefreshToken(refreshToken: string): Session | undefined {
  for (const session of SESSIONS.values()) {
    if (session.refreshToken === refreshToken && session.isActive) {
      // Check if refresh token expired (30 days)
      const refreshExpiry = new Date(session.createdAt.getTime() + REFRESH_TOKEN_EXPIRY)
      if (new Date() > refreshExpiry) {
        invalidateSession(session.sessionId)
        return undefined
      }
      return session
    }
  }
  return undefined
}

export function getClientSessions(clientId: string): Session[] {
  return Array.from(SESSIONS.values())
    .filter(s => s.clientId === clientId && s.isActive)
    .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime())
}

export function invalidateSession(sessionId: string): void {
  const session = SESSIONS.get(sessionId)
  if (session) {
    session.isActive = false
    
    // Remove from device sessions
    const deviceSessions = DEVICE_SESSIONS.get(session.deviceId) || []
    const index = deviceSessions.indexOf(sessionId)
    if (index > -1) {
      deviceSessions.splice(index, 1)
    }
    if (deviceSessions.length === 0) {
      DEVICE_SESSIONS.delete(session.deviceId)
    } else {
      DEVICE_SESSIONS.set(session.deviceId, deviceSessions)
    }
  }
  
  SESSIONS.delete(sessionId)
}

export function invalidateAllClientSessions(clientId: string): void {
  const sessions = getClientSessions(clientId)
  sessions.forEach(session => {
    invalidateSession(session.sessionId)
  })
}

export function invalidateDeviceSessions(deviceId: string): void {
  const sessionIds = DEVICE_SESSIONS.get(deviceId) || []
  sessionIds.forEach(sessionId => {
    invalidateSession(sessionId)
  })
}

export function cleanupExpiredSessions(): void {
  const now = new Date()
  for (const [sessionId, session] of SESSIONS.entries()) {
    // Remove sessions expired more than 7 days ago
    const refreshExpiry = new Date(session.createdAt.getTime() + REFRESH_TOKEN_EXPIRY)
    if (now > refreshExpiry) {
      invalidateSession(sessionId)
    }
  }
}

// Cleanup expired sessions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000)
}
