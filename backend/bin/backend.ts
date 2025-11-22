#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CustomerManagementStack } from '../lib/backend-stack';

const app = new cdk.App();
new CustomerManagementStack(app, 'CustomerManagementStack112220251417', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
