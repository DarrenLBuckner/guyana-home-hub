import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, reason } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Insert into deletion_requests table
    const { error: dbError } = await supabase
      .from('deletion_requests')
      .insert([
        {
          email: email.trim().toLowerCase(),
          reason: reason?.trim() || null,
          status: 'pending',
        },
      ]);

    if (dbError) {
      console.error('Deletion request DB error:', dbError);
      return NextResponse.json({ error: 'Failed to record deletion request' }, { status: 500 });
    }

    // Send confirmation email via Resend
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Guyana Home Hub <info@guyanahomehub.com>',
          to: [email.trim()],
          subject: 'Data Deletion Request Received – Guyana Home Hub',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
              <h2 style="color: #15803d;">Data Deletion Request Received</h2>
              <p>Dear User,</p>
              <p>We have received your request to delete your personal data from Guyana Home Hub. Your request has been logged and will be processed within <strong>30 days</strong>.</p>
              <p>Once your data has been deleted, you will receive a confirmation at this email address.</p>
              <p>If you have any questions or concerns in the meantime, please contact us at:</p>
              <p style="margin: 16px 0;">
                <a href="mailto:info@guyanahomehub.com" style="color: #15803d; font-weight: bold;">info@guyanahomehub.com</a>
              </p>
              <p>Thank you,<br/>The Guyana Home Hub Team</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="font-size: 12px; color: #9ca3af;">
                Guyana Home Hub &middot; A subsidiary of Caribbean Home Hub LLC, Missouri, USA.<br/>
                <a href="https://www.guyanahomehub.com/privacy" style="color: #9ca3af;">Privacy Policy</a>
              </p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const emailErr = await emailResponse.text();
        console.error('Resend email error for deletion confirmation:', emailErr);
        // Non-blocking: request is still recorded even if email fails
      }
    } catch (emailError) {
      console.error('Failed to send deletion confirmation email:', emailError);
      // Non-blocking: don't fail the request if email sending fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
