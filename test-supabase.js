// Test Supabase connection and tables
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTables() {
  try {
    // Test 1: Check agent_vetting table
    const { data: agentData, error: agentError } = await supabase
      .from('agent_vetting')
      .select('count')
      .limit(1)
    
    console.log('✅ agent_vetting table:', agentError ? 'MISSING' : 'EXISTS')
    if (agentError) console.log('   Error:', agentError.message)
    
    // Test 2: Check profiles table  
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      
    console.log('✅ profiles table:', profileError ? 'MISSING' : 'EXISTS')
    if (profileError) console.log('   Error:', profileError.message)
    
    // Test 3: Check properties table
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .select('count')
      .limit(1)
      
    console.log('✅ properties table:', propError ? 'MISSING' : 'EXISTS')
    if (propError) console.log('   Error:', propError.message)
    
  } catch (error) {
    console.error('Connection failed:', error)
  }
}

testTables()
