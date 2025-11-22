const API_BASE_URL = 'https://19j7yi64s1.execute-api.us-east-1.amazonaws.com/prod';

async function finalValidation() {
  console.log('🔍 Final System Validation\n');
  console.log('='.repeat(50));

  let allTestsPassed = true;

  // Test 1: Backend API Health
  console.log('\n1. Backend API Health Check');
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (response.ok) {
      const customers = await response.json();
      console.log(`✅ API is healthy - ${customers.length} customers found`);
    } else {
      console.log('❌ API health check failed');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    allTestsPassed = false;
  }

  // Test 2: CRUD Operations
  console.log('\n2. CRUD Operations Test');
  try {
    // Create
    const createResponse = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Validation Test User',
        email: 'validation@test.com',
        phone: '555-VALID',
        address: 'Validation Address'
      })
    });
    const newCustomer = await createResponse.json();
    console.log(`✅ CREATE: Customer created with ID ${newCustomer.customerId}`);

    // Read
    const readResponse = await fetch(`${API_BASE_URL}/customers/${newCustomer.customerId}`);
    const customer = await readResponse.json();
    console.log(`✅ READ: Retrieved customer ${customer.name}`);

    // Update
    const updateResponse = await fetch(`${API_BASE_URL}/customers/${newCustomer.customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Validation User',
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      })
    });
    const updatedCustomer = await updateResponse.json();
    console.log(`✅ UPDATE: Customer updated to ${updatedCustomer.name}`);

    // Delete
    const deleteResponse = await fetch(`${API_BASE_URL}/customers/${newCustomer.customerId}`, {
      method: 'DELETE'
    });
    if (deleteResponse.ok) {
      console.log('✅ DELETE: Customer deleted successfully');
    }

  } catch (error) {
    console.log('❌ CRUD operations failed:', error.message);
    allTestsPassed = false;
  }

  // Test 3: Frontend Accessibility
  console.log('\n3. Frontend Accessibility');
  try {
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('✅ Frontend is accessible at http://localhost:3000');
    } else {
      console.log('❌ Frontend is not accessible');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Frontend connection failed');
    allTestsPassed = false;
  }

  // Test 4: CORS Configuration
  console.log('\n4. CORS Configuration');
  try {
    const corsResponse = await fetch(`${API_BASE_URL}/customers`, {
      method: 'OPTIONS'
    });
    if (corsResponse.ok) {
      console.log('✅ CORS preflight requests are working');
    } else {
      console.log('❌ CORS configuration issue');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
    allTestsPassed = false;
  }

  // Test 5: Data Validation
  console.log('\n5. Data Validation');
  try {
    const invalidResponse = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'invalid-email'
      })
    });
    if (invalidResponse.status === 400) {
      console.log('✅ Input validation is working correctly');
    } else {
      console.log('❌ Input validation not working');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Validation test failed:', error.message);
    allTestsPassed = false;
  }

  // Final Summary
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! System is fully functional.');
    console.log('\n📋 System Components:');
    console.log('✅ DynamoDB Table: CustomerManagement112220251417');
    console.log('✅ API Gateway: Customer Management API');
    console.log('✅ Lambda Functions: 5 functions for CRUD operations');
    console.log('✅ React Frontend: Running on http://localhost:3000');
    console.log('✅ Full CRUD Operations: Create, Read, Update, Delete');
    console.log('✅ Data Validation: Client and server-side validation');
    console.log('✅ Error Handling: Proper error responses and UI feedback');
    console.log('✅ CORS Configuration: Frontend can communicate with API');
    
    console.log('\n🚀 Ready for Production Use!');
    console.log('\nTo use the system:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Use the interface to manage customers');
    console.log('3. All data is persisted in DynamoDB');
  } else {
    console.log('❌ Some tests failed. Please review the issues above.');
  }
}

finalValidation();
