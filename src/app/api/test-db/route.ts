import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Test agent_vetting table
    const { data: agentData, error: agentError } = await supabase
      .from('agent_vetting')
      .select('count')
      .limit(1)
    
    // Test profiles table  
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      
    // Test properties table
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .select('count')
      .limit(1)
    
    const results = {
      agent_vetting: agentError ? { exists: false, error: agentError.message } : { exists: true },
      profiles: profileError ? { exists: false, error: profileError.message } : { exists: true },
      properties: propError ? { exists: false, error: propError.message } : { exists: true }
    }
    
    return NextResponse.json(results)
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
