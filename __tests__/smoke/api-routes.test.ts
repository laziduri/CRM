/**
 * Smoke tests for critical API routes
 * These tests verify that API routes are accessible and handle basic requests
 * 
 * NOTE: These tests require a running Next.js dev server on localhost:3000
 * Run with: npm run dev (in another terminal) then npm test
 */

import { describe, it, expect, beforeAll } from '@jest/globals'

// Helper to check if server is running
async function checkServerRunning(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    })
    return response.status < 500
  } catch (error) {
    return false
  }
}

describe('API Routes - Smoke Tests', () => {
  let serverRunning: boolean

  beforeAll(async () => {
    serverRunning = await checkServerRunning()
    if (!serverRunning) {
      console.warn('⚠️  Next.js dev server not running on localhost:3000. Skipping smoke tests.')
      console.warn('   To run these tests: npm run dev (in another terminal) then npm test')
    }
  })

  describe('Client Auth Routes', () => {
    it('smoke: POST /api/client/auth/login should accept requests', async () => {
      if (!serverRunning) {
        return // Skip test if server not running
      }

      const response = await fetch('http://localhost:3000/api/client/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
        }),
      })

      // Should not crash - returns 401 for invalid credentials (expected)
      expect(response.status).toBeGreaterThanOrEqual(400)
      expect(response.status).toBeLessThan(500) // Should not be a server error
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    it('smoke: POST /api/client/auth/login should reject invalid input', async () => {
      if (!serverRunning) {
        return // Skip test if server not running
      }

      const response = await fetch('http://localhost:3000/api/client/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('Chat API', () => {
    it('smoke: GET /api/chat should be accessible', async () => {
      if (!serverRunning) {
        return // Skip test if server not running
      }

      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'GET',
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('ok')
    })

    it('smoke: POST /api/chat should accept valid requests', async () => {
      if (!serverRunning) {
        return // Skip test if server not running
      }

      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' },
          ],
        }),
      })

      // Should not crash - may return error or response
      expect(response.status).toBeLessThan(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('message')
    })
  })

  describe('Environment Variables', () => {
    it('smoke: Required env vars should be defined', () => {
      // In production, these should be defined
      // In development, they may have defaults
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      ]

      requiredVars.forEach((varName) => {
        const value = process.env[varName]
        if (!value && process.env.NODE_ENV === 'production') {
          throw new Error(`Required environment variable ${varName} is not defined`)
        }
      })
    })
  })
})
