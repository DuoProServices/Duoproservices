#!/usr/bin/env node

/**
 * 🧪 TESTE DE BACKEND - Verifica se Edge Function está rodando
 * 
 * USO: node test-backend.js
 */

const PROJECT_ID = 'lqpmyvizjfwzddxspacv';
const BASE_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0`;

const endpoints = [
  { name: 'Health Check', url: `${BASE_URL}/health`, method: 'GET' },
  { name: 'Admin Clients', url: `${BASE_URL}/admin/clients`, method: 'GET' },
  { name: 'Create Buckets', url: `${BASE_URL}/admin/create-buckets`, method: 'POST' },
  { name: 'Setup Policies', url: `${BASE_URL}/admin/setup-storage-policies`, method: 'POST' },
];

console.log('🧪 TESTANDO BACKEND EDGE FUNCTION...\n');
console.log(`📡 Base URL: ${BASE_URL}\n`);
console.log('━'.repeat(60));

async function testEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const responseTime = Date.now() - startTime;
    const status = response.status;
    
    if (response.ok || status === 401 || status === 403) {
      // 401/403 means backend is running but needs auth
      console.log(`✅ ${endpoint.name.padEnd(20)} - ONLINE (${status}, ${responseTime}ms)`);
      return true;
    } else {
      console.log(`⚠️  ${endpoint.name.padEnd(20)} - ERROR (${status}, ${responseTime}ms)`);
      return false;
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.log(`❌ ${endpoint.name.padEnd(20)} - TIMEOUT (${responseTime}ms)`);
    } else if (error.message.includes('fetch')) {
      console.log(`❌ ${endpoint.name.padEnd(20)} - OFFLINE (${error.message})`);
    } else {
      console.log(`❌ ${endpoint.name.padEnd(20)} - ERROR (${error.message})`);
    }
    return false;
  }
}

async function runTests() {
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  
  console.log('━'.repeat(60));
  
  const allOnline = results.every(r => r);
  const allOffline = results.every(r => !r);
  
  if (allOnline) {
    console.log('\n✅ SUCCESS! Backend is ONLINE and responding!\n');
    console.log('🎉 All endpoints are working correctly.');
    console.log('📊 You can now use the admin dashboard.\n');
    process.exit(0);
  } else if (allOffline) {
    console.log('\n❌ BACKEND IS OFFLINE!\n');
    console.log('📋 TO FIX THIS:');
    console.log('');
    console.log('Windows PowerShell:');
    console.log('  .\\deploy-agora.ps1');
    console.log('');
    console.log('Mac/Linux Terminal:');
    console.log('  ./deploy-agora.sh');
    console.log('');
    console.log('Or manually:');
    console.log(`  supabase functions deploy server --project-ref ${PROJECT_ID} --no-verify-jwt`);
    console.log('');
    process.exit(1);
  } else {
    console.log('\n⚠️  PARTIAL ISSUES DETECTED!\n');
    console.log('Some endpoints are working but others are not.');
    console.log('Try deploying again to fix any issues.\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n💥 ERROR RUNNING TESTS:', error);
  process.exit(1);
});
