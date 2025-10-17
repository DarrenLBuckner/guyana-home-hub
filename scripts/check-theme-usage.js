#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for improper useCountryTheme usage...');

let hasErrors = false;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check if file imports useCountryTheme
  if (content.includes('useCountryTheme')) {
    
    // Check for missing parentheses (common mistake)
    if (content.includes('= useCountryTheme;')) {
      console.log(`❌ ERROR in ${relativePath}: useCountryTheme called without ()`);
      console.log('   Fix: const { theme } = useCountryTheme();');
      console.log('');
      hasErrors = true;
    }
    
    // Check for missing 'use client' directive
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      console.log(`⚠️  WARNING in ${relativePath}: Missing 'use client' directive`);
      console.log("   Add: 'use client' at the top of the file");
      console.log('');
    }
    
    // Check for rendering theme object directly (basic check)
    if (content.includes('{theme}') && !content.includes('{theme.')) {
      console.log(`❌ ERROR in ${relativePath}: Possibly rendering theme object directly`);
      console.log('   Fix: Use {theme.name} or other specific properties');
      console.log('');
      hasErrors = true;
    }
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      checkFile(fullPath);
    }
  }
}

try {
  scanDirectory('./src');
  
  if (hasErrors) {
    console.log('❌ Theme usage check failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ Theme usage check complete - No issues found!');
  }
} catch (error) {
  console.error('Error during theme check:', error.message);
  process.exit(1);
}