import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    const supabase = createClient()
  const results: any = {}
    
    // Check agent_vetting table
    const { data: agentData, error: agentError, count: agentCount } = await supabase
      .from('agent_vetting')
      .select('*', { count: 'exact' })
      .limit(3)
    
    results.agent_vetting = {
      error: agentError?.message || null,
      count: agentCount,
      sample_data: agentData
    }
    
    // Check profiles table
    const { data: profileData, error: profileError, count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(3)
    
    results.profiles = {
      error: profileError?.message || null,
      count: profileCount,
      sample_data: profileData
    }
    
    // Check properties table
    const { data: propData, error: propError, count: propCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .limit(3)
    
    results.properties = {
      error: propError?.message || null,
      count: propCount,
      sample_data: propData
    }
    
    return NextResponse.json(results)
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
