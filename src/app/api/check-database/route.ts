import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Database Check API - Test if the service_type field exists
 * This helps us determine if the SQL migration has been run
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Try to query the services table and check for service_type field
    const { data, error } = await supabase
      .from('services')
      .select('id, name, service_type')
      .limit(1);

    if (error) {
      // Check if it's a column doesn't exist error
      if (error.message.includes('service_type') || error.code === '42703') {
        return NextResponse.json({
          status: 'migration_needed',
          message: 'service_type column does not exist - SQL migration needed',
          error: error.message
        });
      }
      
      // Other database error
      return NextResponse.json({
        status: 'database_error', 
        message: 'Database connection issue',
        error: error.message
      });
    }

    // Success - migration already run
    return NextResponse.json({
      status: 'migration_complete',
      message: 'service_type column exists - migration already completed',
      sampleData: data
    });

  } catch (error) {
    return NextResponse.json({
      status: 'connection_error',
      message: 'Could not connect to database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}