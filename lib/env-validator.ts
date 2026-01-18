/**
 * Environment variable validation and type-safe access
 * Validates required environment variables at startup and provides type-safe access
 */

interface EnvConfig {
  // Supabase (required)
  supabaseUrl: string
  supabaseAnonKey: string
  
  // JWT Secrets (required)
  jwtSecret: string
  jwtRefreshSecret: string
  
  // Optional with defaults
  resendApiKey?: string
  openaiApiKey?: string
  whatsappNumber: string
  googleClientId?: string
  microsoftClientId?: string
  appUrl: string
  baseUrl: string
  
  // Node environment
  nodeEnv: 'development' | 'production' | 'test'
}

class EnvValidationError extends Error {
  constructor(missingVars: string[]) {
    super(
      `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please check your .env.local file or see .env.example for required variables.`
    )
    this.name = 'EnvValidationError'
  }
}

let envConfig: EnvConfig | null = null

/**
 * Validates and returns environment configuration
 * Call this at application startup to fail fast if required env vars are missing
 */
export function validateEnv(): EnvConfig {
  if (envConfig) {
    return envConfig
  }

  const missing: string[] = []

  // Required variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const jwtSecret = process.env.JWT_SECRET
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!jwtSecret) missing.push('JWT_SECRET')
  if (!jwtRefreshSecret) missing.push('JWT_REFRESH_SECRET')

  // Only throw in production - allow missing vars in development for local testing
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new EnvValidationError(missing)
  }

  envConfig = {
    supabaseUrl: supabaseUrl || '',
    supabaseAnonKey: supabaseAnonKey || '',
    jwtSecret: jwtSecret || 'brilliance-advisory-secret-key-change-in-production',
    jwtRefreshSecret: jwtRefreshSecret || 'brilliance-advisory-refresh-secret-key-change-in-production',
    resendApiKey: process.env.RESEND_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    whatsappNumber: process.env.WHATSAPP_NUMBER || '6591234567',
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  }

  // Log warnings for missing optional vars in development
  if (process.env.NODE_ENV === 'development') {
    if (!envConfig.resendApiKey) {
      console.warn('[ENV] RESEND_API_KEY not set - email functionality will be disabled')
    }
    if (!envConfig.openaiApiKey) {
      console.warn('[ENV] OPENAI_API_KEY not set - chat will use fallback responses')
    }
    if (missing.length > 0) {
      console.warn(`[ENV] Missing required variables (allowed in development): ${missing.join(', ')}`)
    }
  }

  return envConfig
}

/**
 * Get validated environment config
 * Returns the cached config or validates and returns it
 */
export function getEnv(): EnvConfig {
  if (!envConfig) {
    return validateEnv()
  }
  return envConfig
}

/**
 * Type-safe environment variable access helpers
 */
export const env = {
  get supabaseUrl() {
    return getEnv().supabaseUrl
  },
  get supabaseAnonKey() {
    return getEnv().supabaseAnonKey
  },
  get jwtSecret() {
    return getEnv().jwtSecret
  },
  get jwtRefreshSecret() {
    return getEnv().jwtRefreshSecret
  },
  get resendApiKey() {
    return getEnv().resendApiKey
  },
  get openaiApiKey() {
    return getEnv().openaiApiKey
  },
  get whatsappNumber() {
    return getEnv().whatsappNumber
  },
  get googleClientId() {
    return getEnv().googleClientId
  },
  get microsoftClientId() {
    return getEnv().microsoftClientId
  },
  get appUrl() {
    return getEnv().appUrl
  },
  get baseUrl() {
    return getEnv().baseUrl
  },
  get nodeEnv() {
    return getEnv().nodeEnv
  },
  get isProduction() {
    return getEnv().nodeEnv === 'production'
  },
  get isDevelopment() {
    return getEnv().nodeEnv === 'development'
  },
}
