import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Update agent status and send notification email
export async function POST(request: NextRequest) {
  try {
    const { agentId, status, message } = await request.json()
    const supabase = await createClient()

    // Fetch agent details (for email)
    const { data: agent, error: fetchError } = await supabase
      .from('agent_vetting')
      .select('agent_email, agent_name')
      .eq('id', agentId)
      .single()

    if (fetchError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update agent_vetting status and optional rejection reason
    const updateFields: any = { status }
    if (status === 'denied' && message) updateFields.rejection_reason = message
    if (status === 'approved') updateFields.rejection_reason = null

    const { error: updateError } = await supabase
      .from('agent_vetting')
      .update(updateFields)
      .eq('id', agentId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update agent status' }, { status: 500 })
    }

    // Optionally update profiles.vetting_status for this user
    await supabase
      .from('profiles')
      .update({ vetting_status: status })
      .eq('id', agentId)

    // Send status email via existing API
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-agent-status-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: agent.agent_email,
        name: agent.agent_name,
        status,
        message
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Agent vetting action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
