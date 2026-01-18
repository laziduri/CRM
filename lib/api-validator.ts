/**
 * API input validation utilities using Zod
 * Provides reusable validation schemas and middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Common validation schemas
 */
export const schemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  uuid: z.string().uuid('Invalid UUID format'),
  id: z.string().min(1, 'ID is required'),
  
  // Client auth
  clientLogin: z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }).refine((data) => data.email || data.username, {
    message: 'Either email or username is required',
    path: ['email'],
  }),
  
  // Consultant auth
  consultantLogin: z.object({
    consultantId: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }).refine((data) => data.consultantId || data.username || data.email, {
    message: 'Consultant ID, username, or email is required',
    path: ['consultantId'],
  }),
  
  // Chat request
  chatRequest: z.object({
    threadId: z.string().optional(),
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1, 'Message content is required'),
    })).min(1, 'At least one message is required'),
  }),
  
  // Loan submission
  personalLoan: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number must be at least 8 characters'),
    loanAmount: z.number().min(1000, 'Minimum loan amount is $1,000').max(500000, 'Maximum loan amount is $500,000'),
    loanPurpose: z.string().min(1, 'Loan purpose is required'),
    employmentStatus: z.string().min(1, 'Employment status is required'),
    monthlyIncome: z.number().min(1000, 'Monthly income must be at least $1,000'),
  }),
  
  businessLoan: z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number must be at least 8 characters'),
    loanAmount: z.number().min(50000, 'Minimum loan amount is $50,000'),
    loanPurpose: z.string().min(1, 'Loan purpose is required'),
    businessType: z.string().min(1, 'Business type is required'),
    yearsInOperation: z.number().min(0, 'Years in operation must be 0 or greater'),
  }),
}

/**
 * Validates request body against a Zod schema
 * Returns validated data or an error response
 */
export async function validateRequestBody<T extends z.ZodTypeAny>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json()
    const validated = await schema.parseAsync(body)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      }
    }
    
    // Invalid JSON
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      ),
    }
  }
}

/**
 * Middleware wrapper for API routes with validation
 * Usage:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const validation = await validateRequestBody(request, schemas.clientLogin)
 *   if (!validation.success) return validation.response
 *   
 *   const { data } = validation
 *   // Use validated data...
 * }
 * ```
 */
export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: (request: NextRequest, data: z.infer<T>) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const validation = await validateRequestBody(request, schema)
    if (!validation.success) {
      return validation.response
    }
    return handler(request, validation.data)
  }
}

/**
 * Validates query parameters
 */
export function validateQueryParams<T extends z.ZodTypeAny>(
  request: NextRequest,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams)
    const validated = schema.parse(params)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      }
    }
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Failed to parse query parameters' },
        { status: 400 }
      ),
    }
  }
}
