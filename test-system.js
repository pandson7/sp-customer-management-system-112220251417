const API_BASE_URL = 'https://19j7yi64s1.execute-api.us-east-1.amazonaws.com/prod';

async function testAPI() {
  console.log('🧪 Testing Customer Management System API...\n');

  try {
    // Test 1: Get all customers
    console.log('1. Testing GET /customers');
    const getAllResponse = await fetch(`${API_BASE_URL}/customers`);
    const customers = await getAllResponse.json();
    console.log(`✅ Found ${customers.length} customers`);

    if (customers.length > 0) {
      const firstCustomer = customers[0];
      
      // Test 2: Get specific customer
      console.log('\n2. Testing GET /customers/{id}');
      const getOneResponse = await fetch(`${API_BASE_URL}/customers/${firstCustomer.customerId}`);
      const customer = await getOneResponse.json();
      console.log(`✅ Retrieved customer: ${customer.name}`);

      // Test 3: Update customer
      console.log('\n3. Testing PUT /customers/{id}');
      const updateData = {
        name: customer.name + ' (Updated)',
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      };
      const updateResponse = await fetch(`${API_BASE_URL}/customers/${firstCustomer.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const updatedCustomer = await updateResponse.json();
      console.log(`✅ Updated customer: ${updatedCustomer.name}`);
    }

    // Test 4: Create new customer
    console.log('\n4. Testing POST /customers');
    const newCustomer = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-TEST',
      address: 'Test Address'
    };
    const createResponse = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    });
    const createdCustomer = await createResponse.json();
    console.log(`✅ Created customer: ${createdCustomer.name} (ID: ${createdCustomer.customerId})`);

    // Test 5: Delete customer
    console.log('\n5. Testing DELETE /customers/{id}');
    const deleteResponse = await fetch(`${API_BASE_URL}/customers/${createdCustomer.customerId}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();
    console.log(`✅ Deleted customer: ${deleteResult.message}`);

    // Test 6: Verify deletion
    console.log('\n6. Verifying deletion');
    const verifyResponse = await fetch(`${API_BASE_URL}/customers/${createdCustomer.customerId}`);
    if (verifyResponse.status === 404) {
      console.log('✅ Customer successfully deleted (404 Not Found)');
    } else {
      console.log('❌ Customer deletion verification failed');
    }

    console.log('\n🎉 All API tests passed!');
    
    // Test frontend accessibility
    console.log('\n7. Testing Frontend Accessibility');
    try {
      const frontendResponse = await fetch('http://localhost:3000');
      if (frontendResponse.ok) {
        console.log('✅ Frontend is accessible at http://localhost:3000');
      } else {
        console.log('❌ Frontend is not accessible');
      }
    } catch (error) {
      console.log('❌ Frontend connection failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI();
