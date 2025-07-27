import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function pollAndSendAdminNotifications() {
  // Get pending notifications
  const { data, error } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching notifications:', error);
    return;
  }

  for (const notification of data) {
    // Send email via Resend
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: notification.admin_email,
        subject: notification.title,
        html: `<h2>${notification.title}</h2><p>${notification.message}</p><p><strong>Time:</strong> ${notification.created_at}</p>`,
        text: `${notification.title}\n\n${notification.message}\n\nTime: ${notification.created_at}`,
      });

      // Log as sent (optional: update a status column or move to log table)
      await supabase
        .from('admin_email_log')
        .insert([{
          notification_id: notification.id,
          admin_email: notification.admin_email,
          email_payload: notification,
          status: 'sent',
          sent_at: new Date().toISOString(),
        }]);
    } catch (err) {
      console.error('Error sending email:', err);
      await supabase
        .from('admin_email_log')
        .insert([{
          notification_id: notification.id,
          admin_email: notification.admin_email,
          email_payload: notification,
          status: 'failed',
          error_message: String(err),
        }]);
    }
  }
}