import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_demo_key')

interface EmailVerificationParams {
  email: string
  name: string
  verificationToken: string
  verificationUrl: string
}

interface DeviceLoginParams {
  email: string
  name: string
  deviceInfo: string
  location: string
  timestamp: string
  verificationUrl?: string
}

export async function sendVerificationEmail(params: EmailVerificationParams) {
  try {
    const { email, name, verificationToken, verificationUrl } = params
    
    const result = await resend.emails.send({
      from: 'Brilliance Advisory <noreply@brillianceadvisory.sg>',
      to: email,
      subject: 'Verify your email address - Brilliance Advisory',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Brilliance Advisory</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${name},</h2>
            <p>Thank you for registering with Brilliance Advisory. To complete your registration and secure your account, please verify your email address.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Verify Email Address</a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #9ca3af; word-break: break-all;">${verificationUrl}</p>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">This verification link will expire in 24 hours.</p>
            <p style="font-size: 14px; color: #6b7280;">If you didn't create an account with Brilliance Advisory, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">© ${new Date().getFullYear()} Brilliance Advisory. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[Email] Verification email error:', error)
    // In development, we'll still return success to not block registration
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Email] Development mode: Email not sent, but registration continues')
      return { success: true, messageId: 'dev-mode' }
    }
    throw error
  }
}

export async function sendDeviceLoginNotification(params: DeviceLoginParams) {
  try {
    const { email, name, deviceInfo, location, timestamp, verificationUrl } = params
    
    const result = await resend.emails.send({
      from: 'Brilliance Advisory <noreply@brillianceadvisory.sg>',
      to: email,
      subject: 'New device login detected - Brilliance Advisory',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Device Login</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Brilliance Advisory</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-top: 0;">Security Alert</h2>
            <p>Hello ${name},</p>
            <p>We detected a login to your account from a new device or location.</p>
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #14b8a6;">
              <p style="margin: 5px 0;"><strong>Device:</strong> ${deviceInfo}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${timestamp}</p>
            </div>
            ${verificationUrl 
              ? `<p>If this wasn't you, please secure your account immediately:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Secure Account</a>
              </div>`
              : '<p>If this wasn\'t you, please change your password immediately and contact support.</p>'
            }
            <p style="font-size: 14px; color: #6b7280;">If this was you, you can safely ignore this notification.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">© ${new Date().getFullYear()} Brilliance Advisory. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('[Email] Device login notification error:', error)
    // In development, don't fail the login
    if (process.env.NODE_ENV === 'development') {
      return { success: true, messageId: 'dev-mode' }
    }
    return { success: false, error }
  }
}
