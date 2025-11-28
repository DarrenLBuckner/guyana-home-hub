import { Resend } from 'resend';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Resend after loading environment
const resend = new Resend(process.env.RESEND_API_KEY!);

async function testEmail() {
  console.log('🚀 Testing Resend email configuration...');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    return;
  }
  
  console.log('✅ API Key found:', process.env.RESEND_API_KEY.slice(0, 8) + '****');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'leads@portalhomehub.com',
      to: ['mrdarrenbuckner@gmail.com'],
      subject: 'Resend Test Email - Guyana Home Hub',
      html: `
        <h2>🎉 Resend Configuration Test</h2>
        <p>If you receive this email, your Resend API is configured correctly!</p>
        <p><strong>Sent from:</strong> Guyana Home Hub</p>
        <p><strong>Date:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p><em>This is a test email for the "Request Viewing" feature setup.</em></p>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
    } else {
      console.log('✅ Email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      console.log('📬 Recipient: mrdarrenbuckner@gmail.com');
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

testEmail();