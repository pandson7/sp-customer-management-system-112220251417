# AWS Architecture Diagrams - Customer Management System

This directory contains AWS architecture diagrams generated based on the technical design specifications in `specs/design.md`.

## Generated Diagrams

### 1. Customer Management System Architecture (`customer-management-architecture.png`)
- **Purpose**: High-level system architecture overview
- **Components**: React frontend, API Gateway, Lambda functions, DynamoDB
- **Shows**: Complete serverless architecture with data flow between components
- **Key Features**: 
  - User interaction with React frontend
  - REST API endpoints through API Gateway
  - Five Lambda functions for CRUD operations
  - DynamoDB as the data store
  - CloudWatch for monitoring and logging

### 2. Customer Data Flow - CRUD Operations (`customer-data-flow.png`)
- **Purpose**: Detailed view of data flow for each CRUD operation
- **Components**: User interfaces, API endpoints, Lambda functions, DynamoDB operations
- **Shows**: Four distinct flows for Create, Read, Update, Delete operations
- **Key Features**:
  - Create: Form → POST API → CreateCustomer Lambda → DynamoDB PutItem
  - Read: List View → GET API → GetCustomers Lambda → DynamoDB Scan
  - Update: Edit Form → PUT API → UpdateCustomer Lambda → DynamoDB UpdateItem
  - Delete: Confirmation → DELETE API → DeleteCustomer Lambda → DynamoDB DeleteItem

### 3. Deployment Architecture (`deployment-architecture.png`)
- **Purpose**: Infrastructure deployment and development environment setup
- **Components**: Development machine, AWS services, CDK infrastructure
- **Shows**: How the system is deployed and managed
- **Key Features**:
  - Local React development server
  - AWS CDK for Infrastructure as Code
  - Lambda function deployment
  - CloudWatch monitoring integration
  - API Gateway configuration

### 4. Security & Data Model (`security-data-model.png`)
- **Purpose**: Security considerations and data model structure
- **Components**: Security layers, DynamoDB schema, validation rules, error handling
- **Shows**: Data validation, security measures, and error handling strategies
- **Key Features**:
  - HTTPS/TLS encryption
  - CORS policy configuration
  - Input validation and sanitization
  - DynamoDB table schema with partition key
  - Structured error responses

## Architecture Highlights

### Serverless Design
- **No server management**: All compute runs on AWS Lambda
- **Auto-scaling**: Lambda functions scale automatically with demand
- **Cost-effective**: Pay only for actual usage

### Data Storage
- **DynamoDB**: NoSQL database with on-demand billing
- **Single table design**: CustomerManagement table with customerId as partition key
- **Attributes**: name, email, phone, address, registrationDate, createdAt, updatedAt

### API Design
- **RESTful endpoints**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **CORS enabled**: Allows frontend to communicate with API
- **Error handling**: Proper HTTP status codes and error messages

### Development Workflow
- **Local development**: React app runs locally, connects to AWS API
- **Infrastructure as Code**: AWS CDK manages all AWS resources
- **Monitoring**: CloudWatch provides logs and metrics

## Technical Stack

- **Frontend**: React.js (local development server)
- **API Layer**: AWS API Gateway (REST API)
- **Compute**: AWS Lambda (Node.js 18.x runtime)
- **Database**: Amazon DynamoDB (on-demand billing)
- **Infrastructure**: AWS CDK (TypeScript)
- **Monitoring**: Amazon CloudWatch

## Security Considerations

- **Input validation**: Server-side validation for all inputs
- **Data sanitization**: Protection against injection attacks
- **HTTPS encryption**: All API communication encrypted
- **Error handling**: No sensitive information in error messages
- **Access control**: Proper IAM roles for Lambda functions

Generated on: 2025-11-22T14:21:30.529-05:00
