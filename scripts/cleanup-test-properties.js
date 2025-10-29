import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupTestProperties() {
  console.log('🔍 Looking for test properties to clean up...');

  try {
    // Query for test properties using actual database schema
    const { data: testProperties, error: queryError } = await supabase
      .from('properties')
      .select('*')
      .or(
        'title.ilike.%TEST SALE%,' +
        'description.ilike.%this is a test%,' +
        'description.ilike.%fake property%,' +
        'title.ilike.%test property%,' +
        'title.ilike.%sample property%,' +
        'title.ilike.%demo property%,' +
        'owner_email.ilike.%test%,' +
        'owner_email.ilike.%demo%,' +
        'price.lt.1000'
      );

    if (queryError) {
      console.error('❌ Error querying test properties:', queryError);
      return;
    }

    if (!testProperties || testProperties.length === 0) {
      console.log('✅ No test properties found to clean up!');
      return;
    }

    console.log(`📋 Found ${testProperties.length} test properties:`);
    testProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title} - $${prop.price} (ID: ${prop.id})`);
    });

    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\n❓ Do you want to delete these test properties? (y/N): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🧹 Cleaning up test properties...');

        const propertyIds = testProperties.map(p => p.id);

        // Delete the test properties
        const { error: deleteError } = await supabase
          .from('properties')
          .delete()
          .in('id', propertyIds);

        if (deleteError) {
          console.error('❌ Error deleting test properties:', deleteError);
        } else {
          console.log(`✅ Successfully deleted ${testProperties.length} test properties!`);
          console.log('🎉 Database cleanup completed!');
        }
      } else {
        console.log('❌ Cleanup cancelled.');
      }

      rl.close();
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

cleanupTestProperties();