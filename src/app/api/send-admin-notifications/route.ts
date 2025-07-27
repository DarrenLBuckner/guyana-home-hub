import { NextResponse } from 'next/server';
import { pollAndSendAdminNotifications } from '@/jobs/sendAdminNotifications';

export async function GET() {
  await pollAndSendAdminNotifications();
  return NextResponse.json({ success: true });
}