import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = [
  'https://verofield.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]

// Helper function to format user timestamp with timezone
function formatUserTimestamp(timestamp: string, timezone: string) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return new Date(timestamp).toLocaleString() + ` (${timezone})`;
  }
}

function buildCorsHeaders(origin?: string | null) {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://verofield.com'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const requestOrigin = req.headers.get('Origin')
  const corsHeaders = buildCorsHeaders(requestOrigin)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')!
    const recaptchaSecretKey = Deno.env.get('RECAPTCHA_SECRET_KEY') || ''
    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL') || 'cseek@verofield.com'

    if (!supabaseUrl || !supabaseServiceKey || !sendgridApiKey) {
      console.error('Missing required environment variables')
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse form data
    const formData = await req.json()
    const { firstName, lastName, email, phone, company, message, recaptchaToken, userTimezone, userTimestamp } = formData
    
    // Validate reCAPTCHA token if provided
    if (recaptchaToken && recaptchaSecretKey) {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: recaptchaSecretKey,
          response: recaptchaToken,
          remoteip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        })
      })
      
      const recaptchaResult = await recaptchaResponse.json()
      
      if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        console.log('reCAPTCHA validation failed:', recaptchaResult)
        return new Response(
          JSON.stringify({ success: false, error: 'Security validation failed' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('reCAPTCHA validation passed, score:', recaptchaResult.score)
    } else if (recaptchaToken) {
      console.log('reCAPTCHA token provided but no secret key configured - skipping validation')
    } else {
      console.log('No reCAPTCHA token provided - using honeypot protection only')
    }

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Email validation passed for:', email)
    console.log('User timezone data received:', { userTimezone, userTimestamp })

    // Sanitize input
    const sanitizedData = {
      first_name: firstName.trim().substring(0, 100),
      last_name: lastName.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 255),
      phone: phone ? phone.trim().substring(0, 20) : null,
      company: company ? company.trim().substring(0, 100) : null,
      message: message ? message.trim().substring(0, 1000) : null,
      user_timezone: userTimezone || 'Unknown',
      user_timestamp: userTimestamp || new Date().toISOString()
    }

    // Insert lead into database
    const { data: leadData, error: dbError } = await supabase
      .from('leads')
      .insert([sanitizedData])
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Lead saved to database:', leadData)
    console.log('User timestamp stored:', sanitizedData.user_timestamp)
    console.log('User timezone stored:', sanitizedData.user_timezone)

    // 1. Send notification email to admin
    const notificationEmailContent = `
      <h2>New Waitlist Signup</h2>
      <p><strong>Name:</strong> ${sanitizedData.first_name} ${sanitizedData.last_name}</p>
      <p><strong>Email:</strong> ${sanitizedData.email}</p>
      <p><strong>Phone:</strong> ${sanitizedData.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${sanitizedData.company || 'Not provided'}</p>
      <p><strong>Message:</strong> ${sanitizedData.message || 'No message provided'}</p>
      <p><strong>Submitted:</strong> ${formatUserTimestamp(sanitizedData.user_timestamp, sanitizedData.user_timezone)} (User's timezone: ${sanitizedData.user_timezone})</p>
      <hr>
      <p>This lead has been saved to your database.</p>
    `

    const notificationEmailData = {
      personalizations: [
        {
          to: [{ email: notificationEmail }],
          subject: `New Waitlist Signup from ${sanitizedData.first_name} ${sanitizedData.last_name}`
        }
      ],
      from: { email: 'cseek@verofield.com', name: 'VeroField' },
      content: [
        {
          type: 'text/html',
          value: notificationEmailContent
        }
      ],
      reply_to: { email: sanitizedData.email, name: `${sanitizedData.first_name} ${sanitizedData.last_name}` }
    }

    // 2. Send confirmation email to user
    const confirmationEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Welcome to VeroField!</h1>
          <p style="color: #6b7280; margin: 10px 0;">Your Complete Service Management Platform</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: white; margin: 0; text-align: center;">You're on the Waitlist!</h2>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">Hi ${sanitizedData.first_name},</p>
        
        <p style="color: #374151; line-height: 1.6;">Thank you for joining the VeroField waitlist! We're excited to have you on board.</p>
        
        <p style="color: #6b7280; font-size: 14px;">You joined on ${formatUserTimestamp(sanitizedData.user_timestamp, sanitizedData.user_timezone)}</p>
        
        <p style="color: #374151; line-height: 1.6;">Here's what you can expect:</p>
        
        <ul style="color: #374151; line-height: 1.6;">
          <li><strong>Early Access:</strong> Be among the first to experience VeroField's powerful features</li>
          <li><strong>Special Pricing:</strong> Exclusive launch discounts for waitlist members</li>
          <li><strong>Updates:</strong> Regular updates on our progress and new features</li>
          <li><strong>Priority Support:</strong> Get help when you need it most</li>
        </ul>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #7c3aed; margin-top: 0;">What's Next?</h3>
          <p style="color: #374151; margin-bottom: 0;">We'll be in touch soon with updates about our launch timeline and how to get started with VeroField.</p>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">If you have any questions in the meantime, feel free to reply to this email.</p>
        
        <p style="color: #374151; line-height: 1.6;">Best regards,<br>The VeroField Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="text-align: center; color: #6b7280; font-size: 12px;">
          <p>VeroField - Transform Your Service Business</p>
          <p>This email was sent because you joined our waitlist at <a href="https://verofield.com" style="color: #7c3aed;">verofield.com</a></p>
        </div>
      </div>
    `

    const confirmationEmailData = {
      personalizations: [
        {
          to: [{ email: sanitizedData.email, name: `${sanitizedData.first_name} ${sanitizedData.last_name}` }],
          subject: `Welcome to VeroField - You're on the Waitlist!`
        }
      ],
      from: { email: 'cseek@verofield.com', name: 'VeroField Team' },
      content: [
        {
          type: 'text/html',
          value: confirmationEmailContent
        }
      ]
    }

    // Send both emails
    const sendEmail = async (emailData: any, emailType: string) => {
      try {
        console.log(`Sending ${emailType} email to:`, emailData.personalizations[0].to[0].email)
        console.log(`${emailType} email data:`, JSON.stringify(emailData, null, 2))
        
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`SendGrid ${emailType} error:`, errorText)
          console.error(`SendGrid ${emailType} status:`, response.status)
          console.error(`SendGrid ${emailType} headers:`, response.headers)
          return false
    } else {
          console.log(`${emailType} sent successfully to:`, emailData.personalizations[0].to[0].email)
          return true
        }
      } catch (error) {
        console.error(`Error sending ${emailType}:`, error)
        return false
      }
    }

    // Send notification email to admin
    const notificationSent = await sendEmail(notificationEmailData, 'notification')
    
    // Send confirmation email to user
    const confirmationSent = await sendEmail(confirmationEmailData, 'confirmation')

    // Log results
    console.log('Email sending results:', {
      notification: notificationSent ? 'sent' : 'failed',
      confirmation: confirmationSent ? 'sent' : 'failed'
    })

    // Determine success message based on email results
    let successMessage = 'Thanks! You are on the waitlist. We will be in touch soon.';
    if (!confirmationSent && notificationSent) {
      console.log('Confirmation email failed but notification sent - user still signed up successfully');
      successMessage = 'Thanks! You are on the waitlist. We will be in touch soon.';
    } else if (!notificationSent && !confirmationSent) {
      console.log('Both emails failed - but lead was saved to database');
      successMessage = 'Thanks! You are on the waitlist. We will be in touch soon.';
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: successMessage,
        leadId: leadData?.[0]?.id,
        emailStatus: {
          notification: notificationSent,
          confirmation: confirmationSent
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})