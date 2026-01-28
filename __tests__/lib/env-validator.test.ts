/**
 * Tests for environment variable validation
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { validateEnv, getEnv, env, __resetEnvConfigForTesting } from '@/lib/env-validator'

describe('env-validator', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset env before each test by clearing and restoring
    Object.keys(process.env).forEach((key) => {
      delete process.env[key]
    })
    Object.assign(process.env, originalEnv)
  })

  afterEach(() => {
    // Restore original env
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    })
    Object.assign(process.env, originalEnv)
  })

  describe('validateEnv', () => {
    it('should validate environment variables', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
      process.env.JWT_SECRET = 'test-secret'
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'

      const config = validateEnv()

      expect(config.supabaseUrl).toBe('https://test.supabase.co')
      expect(config.supabaseAnonKey).toBe('test-key')
      expect(config.jwtSecret).toBe('test-secret')
    })

    it('should use defaults for optional variables', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
      process.env.JWT_SECRET = 'test-secret'
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'

      const config = validateEnv()

      expect(config.whatsappNumber).toBe('6591234567')
      expect(config.appUrl).toBe('http://localhost:3000')
    })

    it('should allow missing vars in development', () => {
      // Use Object.defineProperty to bypass TypeScript's read-only check for NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      })
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      // Should not throw in development
      expect(() => validateEnv()).not.toThrow()
    })
  })

  describe('getEnv', () => {
    it('should return validated config', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
      process.env.JWT_SECRET = 'test-secret'
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'

      const config = getEnv()

      expect(config).toBeDefined()
      expect(config.supabaseUrl).toBe('https://test.supabase.co')
    })
  })

  describe('env helpers', () => {
    it('should provide type-safe access', () => {
      __resetEnvConfigForTesting()
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
      process.env.JWT_SECRET = 'test-secret'
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
      // Set NODE_ENV for this test so getEnv() caches with development
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      })

      expect(env.supabaseUrl).toBe('https://test.supabase.co')
      expect(env.isDevelopment).toBe(true)
    })
  })
})
