/**
 * Centralized error handling and logging utility
 * Provides consistent error responses and logging for API routes
 */

import { NextResponse } from 'next/server'

export enum ErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface ApiError {
  code: ErrorCode
  message: string
  details?: unknown
  statusCode: number
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    
    // Map error codes to HTTP status codes
    const statusCodeMap: Record<ErrorCode, number> = {
      [ErrorCode.BAD_REQUEST]: 400,
      [ErrorCode.UNAUTHORIZED]: 401,
      [ErrorCode.FORBIDDEN]: 403,
      [ErrorCode.NOT_FOUND]: 404,
      [ErrorCode.VALIDATION_ERROR]: 400,
      [ErrorCode.CONFLICT]: 409,
      [ErrorCode.INTERNAL_ERROR]: 500,
      [ErrorCode.DATABASE_ERROR]: 500,
      [ErrorCode.EXTERNAL_API_ERROR]: 502,
      [ErrorCode.SERVICE_UNAVAILABLE]: 503,
    }
    
    this.statusCode = statusCodeMap[code]
  }
}

/**
 * Logs an error with context
 */
function logError(error: unknown, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const errorContext = {
    timestamp,
    ...context,
  }

  if (error instanceof AppError) {
    console.error(`[API Error ${error.code}]`, error.message, {
      ...errorContext,
      statusCode: error.statusCode,
      details: error.details,
    })
  } else if (error instanceof Error) {
    console.error('[API Error]', error.message, {
      ...errorContext,
      stack: error.stack,
      name: error.name,
    })
  } else {
    console.error('[API Error]', 'Unknown error', {
      ...errorContext,
      error,
    })
  }
}

/**
 * Handles errors and returns appropriate NextResponse
 * Use this in API route catch blocks
 * 
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   try {
 *     // ... route logic
 *   } catch (error) {
 *     return handleApiError(error, { route: '/api/client/auth/login' })
 *   }
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context?: Record<string, unknown>
): NextResponse {
  logError(error, context)

  if (error instanceof AppError) {
    const response: Record<string, unknown> = {
      error: error.code,
      message: error.message,
    }
    if (error.details !== undefined) {
      response.details = error.details
    }
    return NextResponse.json(response, { status: error.statusCode })
  }

  // Unknown errors - don't expose details in production
  const isProduction = process.env.NODE_ENV === 'production'
  
  return NextResponse.json(
    {
      error: ErrorCode.INTERNAL_ERROR,
      message: isProduction
        ? 'An internal server error occurred'
        : error instanceof Error
        ? error.message
        : 'An unknown error occurred',
      ...(!isProduction && error instanceof Error && { stack: error.stack }),
    },
    { status: 500 }
  )
}

/**
 * Helper functions for common errors
 */
export const errors = {
  badRequest: (message: string, details?: unknown) =>
    new AppError(ErrorCode.BAD_REQUEST, message, details),
  
  unauthorized: (message = 'Unauthorized') =>
    new AppError(ErrorCode.UNAUTHORIZED, message),
  
  forbidden: (message = 'Forbidden') =>
    new AppError(ErrorCode.FORBIDDEN, message),
  
  notFound: (message = 'Resource not found', details?: unknown) =>
    new AppError(ErrorCode.NOT_FOUND, message, details),
  
  validationError: (message: string, details?: unknown) =>
    new AppError(ErrorCode.VALIDATION_ERROR, message, details),
  
  conflict: (message: string, details?: unknown) =>
    new AppError(ErrorCode.CONFLICT, message, details),
  
  internalError: (message = 'Internal server error', details?: unknown) =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, details),
  
  databaseError: (message = 'Database error', details?: unknown) =>
    new AppError(ErrorCode.DATABASE_ERROR, message, details),
  
  externalApiError: (message: string, details?: unknown) =>
    new AppError(ErrorCode.EXTERNAL_API_ERROR, message, details),
}

/**
 * Async error wrapper for API route handlers
 * Catches errors and returns appropriate response
 * 
 * @example
 * ```ts
 * export const POST = asyncHandler(async (request: NextRequest) => {
 *   // Route logic here - errors are automatically caught
 *   return NextResponse.json({ success: true })
 * })
 * ```
 */
export function asyncHandler(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error) {
      return handleApiError(error, {
        method: request.method,
        url: request.url,
      })
    }
  }
}
