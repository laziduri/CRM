/**
 * Logger utility for development and production
 * In production, only errors are logged
 * In development, all logs are shown
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
    // In production, you might want to send warnings to error tracking service
  },
  
  error: (...args: unknown[]) => {
    // Always log errors, but in production you should send to error tracking service
    console.error(...args)
    // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
}
