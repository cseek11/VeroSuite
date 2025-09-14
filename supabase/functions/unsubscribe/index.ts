import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = [
  'https://verofield.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'null' // Allow file:// origin for local testing
]

function buildCorsHeaders(origin?: string | null) {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://verofield.com'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    const notificationEmail = 'cseek@verofield.com' // Hardcoded to ensure correct email

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

    // Get email and token from query parameters
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    const token = url.searchParams.get('token')

    console.log('Unsubscribe request details:', {
      fullUrl: req.url,
      email: email,
      token: token,
      searchParams: Object.fromEntries(url.searchParams)
    })

    if (!email || !token) {
      console.error('Missing email or token in unsubscribe request')
      return new Response(
        JSON.stringify({ success: false, error: 'Missing email or token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Unsubscribe request for:', email, 'with token:', token)

    let leadData: any = null

    // First, let's try to find the lead with just the token (ID)
    const { data: leadById, error: idError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', token)
      .single()

    console.log('Lead search by ID:', {
      token: token,
      found: !!leadById,
      error: idError,
      leadData: leadById
    })

    // If not found by ID, try by email
    if (!leadById || idError) {
      const { data: leadByEmail, error: emailError } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      console.log('Lead search by email:', {
        email: email.toLowerCase(),
        found: !!leadByEmail,
        error: emailError,
        leadData: leadByEmail
      })

      if (!leadByEmail || emailError) {
        // Show detailed error page instead of JSON
        const errorPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe Error - VeroField</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #f9fafb;
      color: #374151;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #ef4444;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .back-link {
      display: inline-block;
      margin-top: 20px;
      color: #7c3aed;
      text-decoration: none;
      font-weight: bold;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    ul {
      text-align: left;
      max-width: 300px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚠️</div>
    <h1>Unable to Unsubscribe</h1>
    <p>We couldn't find your email address in our waitlist.</p>
    <p>This could mean:</p>
    <ul>
      <li>You've already unsubscribed</li>
      <li>The email address doesn't match our records</li>
      <li>The unsubscribe link has expired</li>
    </ul>
    <p>If you continue to receive emails, please contact us directly.</p>
    <a href="https://verofield.com" class="back-link">← Back to VeroField</a>
  </div>
</body>
</html>`
        return new Response(null, {
          status: 302,
          headers: { 
            'Location': 'https://verofield.com/unsubscribed.html?success=false&email=' + encodeURIComponent(email),
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      }

      // Use the lead found by email
      leadData = leadByEmail
    } else {
      // Use the lead found by ID
      leadData = leadById
    }

    if (!leadData) {
      console.error('No lead data found after all attempts')
      return new Response(
        JSON.stringify({ success: false, error: 'Lead not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Delete the lead from database
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', token)

    if (deleteError) {
      console.error('Database error deleting lead:', deleteError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to unsubscribe' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Lead deleted successfully:', leadData)

    // Send notification email to admin about unsubscribe
    const unsubscribeNotificationContent = `
      <h2>User Unsubscribed from Waitlist</h2>
      <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
      <p><strong>Email:</strong> ${leadData.email}</p>
      <p><strong>Company:</strong> ${leadData.company || 'Not provided'}</p>
      <p><strong>Unsubscribed:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p>This user has been removed from the waitlist and will no longer receive emails.</p>
    `

    const unsubscribeNotificationData = {
      personalizations: [
        {
          to: [{ email: notificationEmail }],
          subject: `User Unsubscribed: ${leadData.first_name} ${leadData.last_name}`
        }
      ],
      from: { email: 'cseek@verofield.com', name: 'VeroField' },
      content: [
        {
          type: 'text/html',
          value: unsubscribeNotificationContent
        }
      ]
    }

    // Send notification email
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unsubscribeNotificationData)
      })

      if (response.ok) {
        console.log('Unsubscribe notification sent to admin')
      } else {
        console.error('Failed to send unsubscribe notification')
      }
    } catch (emailError) {
      console.error('Error sending unsubscribe notification:', emailError)
    }

    // Return success page HTML
    const successPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - VeroField</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #f9fafb;
      color: #374151;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #10b981;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .back-link {
      display: inline-block;
      margin-top: 20px;
      color: #7c3aed;
      text-decoration: none;
      font-weight: bold;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✅</div>
    <h1>Successfully Unsubscribed</h1>
    <p>You have been successfully unsubscribed from VeroField waitlist emails.</p>
    <p>We're sorry to see you go! If you change your mind, you can always rejoin our waitlist at any time.</p>
    <p>You will no longer receive emails from us.</p>
    <a href="https://verofield.com" class="back-link">← Back to VeroField</a>
  </div>
</body>
</html>`

    // Redirect to the unsubscribed page on your website
    return new Response(null, {
      status: 302,
      headers: { 
        'Location': 'https://verofield.com/unsubscribed.html?success=true&email=' + encodeURIComponent(leadData.email),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

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
