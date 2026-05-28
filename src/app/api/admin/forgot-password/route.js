import { NextResponse } from 'next/server'
import { findUserByEmail, createResetToken } from '@/lib/db/adminUsers'
import { getSettingsMap } from '@/lib/db/siteSettings'

async function sendResetEmail(toEmail, token, emailjsSettings) {
  const { service_id, public_key, template_id } = emailjsSettings
  if (!service_id || !public_key || !template_id) return false
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id,
        template_id,
        user_id: public_key,
        template_params: {
          to_email: toEmail,
          reset_token: token,
          expiry: '1 hour',
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(request) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })

  const user = await findUserByEmail(email)
  // Always respond the same way to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true, sent: false })

  const token = await createResetToken(email)

  // Try to send email via EmailJS if configured
  let emailSent = false
  try {
    const map = await getSettingsMap(['emailjs_service_id', 'emailjs_public_key', 'emailjs_contact_template_id'])
    emailSent = await sendResetEmail(email, token, {
      service_id: map.emailjs_service_id || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      public_key: map.emailjs_public_key || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      template_id: map.emailjs_contact_template_id || process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID,
    })
  } catch { /* ignore */ }

  return NextResponse.json({ ok: true, sent: emailSent, token: emailSent ? undefined : token })
}
