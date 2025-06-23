
# AWS Greenhouse IoT System Setup

This directory contains comprehensive guides for setting up a complete AWS-based IoT system for automated greenhouse management.

## Quick Start Checklist

- [ ] **IoT Core Setup** - Device registration and MQTT topics
- [ ] **Lambda Functions** - Data processing and automation logic  
- [ ] **DynamoDB Tables** - Real-time data storage
- [ ] **S3 Buckets** - Historical data and backups
- [ ] **API Gateway** - REST endpoints for frontend
- [ ] **QuickSight** - Analytics and reporting dashboards
- [ ] **Amplify** - Frontend hosting and deployment
- [ ] **Integration Testing** - End-to-end system validation

## Documentation Structure

1. **[IoT Core Setup](./aws-setup/01-iot-core-setup.md)** - MQTT broker and device management
2. **[Lambda Functions](./aws-setup/02-lambda-functions.md)** - Serverless data processing
3. **[DynamoDB Setup](./aws-setup/03-dynamodb-setup.md)** - NoSQL database configuration
4. **[S3 Storage](./aws-setup/04-s3-storage.md)** - Object storage and archival
5. **[API Gateway](./aws-setup/05-api-gateway.md)** - RESTful API endpoints
6. **[QuickSight Analytics](./aws-setup/06-quicksight-analytics.md)** - Business intelligence
7. **[Amplify Deployment](./aws-setup/07-amplify-deployment.md)** - Frontend hosting
8. **[Complete Integration](./aws-setup/08-complete-integration.md)** - End-to-end setup

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Basic understanding of IoT concepts
- Node.js development environment

## Cost Estimation

Expected monthly costs: **$70-120** for moderate usage (1 greenhouse, 1M API calls, 100GB storage)

## Architecture Overview

```
Sensors → IoT Core → Lambda → DynamoDB/S3 → API Gateway → React Frontend
                   ↓
                QuickSight Analytics
```

## Security Considerations

- Device certificates for IoT authentication
- IAM roles with least privilege access
- API Gateway authentication and rate limiting
- Data encryption at rest and in transit

## Support

For questions or issues:
1. Check the specific setup guides in `/docs/aws-setup/`
2. Review AWS documentation links provided in each guide
3. Test configurations in development environment first

## Next Steps

1. Start with IoT Core setup to establish device connectivity
2. Deploy Lambda functions for data processing
3. Configure storage layers (DynamoDB + S3)
4. Set up API Gateway for frontend communication
5. Deploy frontend using Amplify
6. Add analytics with QuickSight

Each guide includes step-by-step instructions, code samples, and troubleshooting tips.
