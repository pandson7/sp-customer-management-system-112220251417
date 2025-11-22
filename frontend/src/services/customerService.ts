export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const API_BASE_URL = 'https://19j7yi64s1.execute-api.us-east-1.amazonaws.com/prod';

class CustomerService {
  async getAllCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    return response.json();
  }

  async createCustomer(customer: CreateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create customer');
    }
    return response.json();
  }

  async updateCustomer(customerId: string, customer: CreateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update customer');
    }
    return response.json();
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete customer');
    }
  }
}

export const customerService = new CustomerService();
