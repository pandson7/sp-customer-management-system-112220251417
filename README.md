# Customer Information Management System

A full-stack customer management application built with React and AWS serverless architecture.

## Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete customers
- ✅ **Real-time Data**: All operations persist to DynamoDB
- ✅ **Search & Filter**: Find customers by name or email
- ✅ **Form Validation**: Client and server-side validation
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Error Handling**: Graceful error handling and user feedback

## Architecture

- **Frontend**: React 18 with TypeScript
- **Backend**: AWS Lambda (Node.js 22.x)
- **Database**: Amazon DynamoDB
- **API**: Amazon API Gateway with CORS
- **Infrastructure**: AWS CDK for deployment

## Quick Start

### Prerequisites
- Node.js 18+ installed
- AWS CLI configured with appropriate permissions
- AWS CDK installed (`npm install -g aws-cdk`)

### Backend Setup
```bash
cd backend
npm install
npm run build
npx cdk deploy --require-approval never
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The application will be available at http://localhost:3000

## API Endpoints

Base URL: `https://19j7yi64s1.execute-api.us-east-1.amazonaws.com/prod/`

- `GET /customers` - Get all customers
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

## Customer Data Model

```typescript
interface Customer {
  customerId: string;        // Auto-generated UUID
  name: string;             // Required
  email: string;            // Required, validated
  phone?: string;           // Optional
  address?: string;         // Optional
  registrationDate: string; // Auto-generated (YYYY-MM-DD)
  createdAt: string;        // Auto-generated timestamp
  updatedAt: string;        // Auto-updated timestamp
}
```

## Usage

1. **View Customers**: The main page displays all customers in a searchable table
2. **Add Customer**: Click "Add New Customer" and fill out the form
3. **Search**: Use the search box to filter customers by name or email
4. **View Details**: Click "View Details" to see full customer information
5. **Edit**: From the detail page, click "Edit Customer" to modify information
6. **Delete**: From the detail page, click "Delete Customer" and confirm

## Testing

Run the validation script to test all functionality:
```bash
node final-validation.js
```

This will test:
- API health and connectivity
- All CRUD operations
- Frontend accessibility
- CORS configuration
- Data validation

## Project Structure

```
├── backend/                 # AWS CDK infrastructure
│   ├── lib/backend-stack.ts # Lambda functions and infrastructure
│   └── bin/backend.ts       # CDK app entry point
├── frontend/                # React application
│   ├── src/components/      # React components
│   ├── src/services/        # API service layer
│   └── public/             # Static assets
└── specs/                   # Requirements and design docs
```

## AWS Resources Created

- DynamoDB Table: `CustomerManagement112220251417`
- API Gateway: Customer Management API
- Lambda Functions: 5 functions for CRUD operations
- IAM Roles: Proper permissions for service interactions
- CloudWatch Logs: For monitoring and debugging

## Development

### Adding New Features
1. Update the data model in `frontend/src/services/customerService.ts`
2. Modify Lambda functions in `backend/lib/backend-stack.ts`
3. Update React components as needed
4. Deploy backend changes with `npx cdk deploy`

### Environment Configuration
The system uses dynamic AWS account resolution. No hardcoded account IDs are used.

## Security

- Input validation on client and server
- CORS properly configured
- No sensitive data in error messages
- Proper IAM permissions with least privilege
- No hardcoded credentials

## Monitoring

- CloudWatch Logs for Lambda functions
- API Gateway access logs
- DynamoDB metrics
- Frontend error boundaries

## Cleanup

To remove all AWS resources:
```bash
cd backend
npx cdk destroy
```

## Support

For issues or questions, refer to the PROJECT_SUMMARY.md for detailed implementation information.

## License

This project is for demonstration purposes.
