import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CustomerManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '112220251417';

    // DynamoDB Table
    const customersTable = new dynamodb.Table(this, `CustomersTable${suffix}`, {
      tableName: `CustomerManagement${suffix}`,
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    customersTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    customersTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Lambda Functions
    const createCustomerFunction = new lambda.Function(this, `CreateCustomer${suffix}`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body);
    
    if (!body.name || !body.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    const customer = {
      customerId: randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      address: body.address || '',
      registrationDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: customer
    }));

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(customer)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const getCustomersFunction = new lambda.Function(this, `GetCustomers${suffix}`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const getCustomerFunction = new lambda.Function(this, `GetCustomer${suffix}`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const customerId = event.pathParameters.customerId;
    
    const result = await docClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { customerId }
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const updateCustomerFunction = new lambda.Function(this, `UpdateCustomer${suffix}`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const customerId = event.pathParameters.customerId;
    const body = JSON.parse(event.body);
    
    if (!body.name || !body.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Check if customer exists
    const existing = await docClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { customerId }
    }));

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }

    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { customerId },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, address = :address, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': body.name,
        ':email': body.email,
        ':phone': body.phone || '',
        ':address': body.address || '',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const deleteCustomerFunction = new lambda.Function(this, `DeleteCustomer${suffix}`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const customerId = event.pathParameters.customerId;
    
    // Check if customer exists
    const existing = await docClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { customerId }
    }));

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }

    await docClient.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { customerId }
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Customer deleted successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    // Grant DynamoDB permissions
    customersTable.grantReadWriteData(createCustomerFunction);
    customersTable.grantReadWriteData(getCustomersFunction);
    customersTable.grantReadWriteData(getCustomerFunction);
    customersTable.grantReadWriteData(updateCustomerFunction);
    customersTable.grantReadWriteData(deleteCustomerFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `CustomerManagementApi${suffix}`, {
      restApiName: `Customer Management API ${suffix}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    const customers = api.root.addResource('customers');
    const customer = customers.addResource('{customerId}');

    customers.addMethod('GET', new apigateway.LambdaIntegration(getCustomersFunction));
    customers.addMethod('POST', new apigateway.LambdaIntegration(createCustomerFunction));
    customer.addMethod('GET', new apigateway.LambdaIntegration(getCustomerFunction));
    customer.addMethod('PUT', new apigateway.LambdaIntegration(updateCustomerFunction));
    customer.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCustomerFunction));

    // Output API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Customer Management API URL',
    });
  }
}
