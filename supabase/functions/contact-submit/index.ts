import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')!
    const notificationEmail = 'cseek@verofield.com'

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
    const { firstName, lastName, email, phone, company, message } = formData

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

    // Sanitize input
    const sanitizedData = {
      first_name: firstName.trim().substring(0, 100),
      last_name: lastName.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 255),
      phone: phone ? phone.trim().substring(0, 20) : null,
      company: company ? company.trim().substring(0, 100) : null,
      message: message ? message.trim().substring(0, 1000) : null
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

    // Send email notification via SendGrid
    const emailContent = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${sanitizedData.first_name} ${sanitizedData.last_name}</p>
      <p><strong>Email:</strong> ${sanitizedData.email}</p>
      <p><strong>Phone:</strong> ${sanitizedData.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${sanitizedData.company || 'Not provided'}</p>
      <p><strong>Message:</strong> ${sanitizedData.message || 'No message provided'}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })}</p>
      <hr>
      <p>This lead has been saved to your database.</p>
    `

    const emailData = {
      personalizations: [
        {
          to: [{ email: notificationEmail }],
          subject: `New Demo Request from ${sanitizedData.first_name} ${sanitizedData.last_name}`
        }
      ],
      from: { email: 'cseek@verofield.com', name: 'VeroField' },
      content: [
        {
          type: 'text/html',
          value: emailContent
        }
      ],
      // Add reply-to for better deliverability
      reply_to: { email: sanitizedData.email, name: `${sanitizedData.first_name} ${sanitizedData.last_name}` }
    }

    console.log('Sending email with data:', JSON.stringify(emailData, null, 2))

    // Send email notification via SendGrid with simplified approach
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('SendGrid error:', errorText)
      console.error('SendGrid status:', emailResponse.status)
      console.error('Email data sent:', JSON.stringify(emailData, null, 2))
      // Don't fail the request if email fails, just log it
    } else {
      console.log('Email sent successfully to:', notificationEmail)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo request submitted successfully! We will be in touch soon.',
        leadId: leadData?.[0]?.id
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