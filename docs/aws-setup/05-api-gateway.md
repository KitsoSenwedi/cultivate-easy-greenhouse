
# API Gateway Setup Guide

## Overview
API Gateway will provide RESTful endpoints for your React frontend to communicate with AWS services.

## Create REST API

### Step 1: Create API
1. Go to **API Gateway** in AWS Console
2. Click **Create API**
3. Choose **REST API** (not private)
4. Click **Build**
5. API name: `GreenhouseAPI`
6. Description: `API for greenhouse management system`
7. Endpoint type: **Regional**
8. Click **Create API**

## API Structure

### Resource: /sensors
1. Click **Actions > Create Resource**
2. Resource name: `sensors`
3. Resource path: `/sensors`
4. Enable CORS: ✓
5. Create resource

#### Method: GET /sensors/latest
1. Select `/sensors` resource
2. Click **Actions > Create Method**
3. Choose **GET**
4. Integration type: **Lambda Function**
5. Lambda function: `greenhouseApiHandler`
6. Save and deploy

#### Method: GET /sensors/history
1. Create another GET method under `/sensors`
2. Add query parameters: `startDate`, `endDate`, `deviceId`

### Resource: /controls
1. Create resource: `controls`
2. Path: `/controls`

#### Method: POST /controls
1. Create POST method
2. Integration: Lambda function
3. Function: `greenhouseApiHandler`

### Resource: /alerts
1. Create resource: `alerts`
2. Methods: GET, POST, PUT

## Enable CORS

### For each method:
1. Select the method
2. Click **Actions > Enable CORS**
3. Access-Control-Allow-Origin: `*`
4. Access-Control-Allow-Methods: Select appropriate methods
5. Click **Enable CORS**

## Request/Response Models

### Sensor Data Model
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Sensor Data",
  "type": "object",
  "properties": {
    "deviceId": { "type": "string" },
    "timestamp": { "type": "number" },
    "temperature": { "type": "number" },
    "humidity": { "type": "number" },
    "soilMoisture": { "type": "number" },
    "lightLevel": { "type": "number" },
    "pestDetection": { "type": "string" }
  },
  "required": ["deviceId", "timestamp"]
}
```

### Control Command Model
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Control Command",
  "type": "object",
  "properties": {
    "action": { 
      "type": "string",
      "enum": ["irrigate", "ventilate", "pest_control", "lighting"]
    },
    "duration": { "type": "number" },
    "intensity": { "type": "string" },
    "zone": { "type": "string" }
  },
  "required": ["action", "zone"]
}
```

## API Documentation

### Endpoints Summary
```
GET    /sensors/latest          - Get latest sensor readings
GET    /sensors/history         - Get historical sensor data
POST   /controls                - Send control commands
GET    /alerts                  - Get active alerts
POST   /alerts                  - Create new alert
PUT    /alerts/{id}             - Update alert status
```

### Authentication (Optional)
1. Create **Cognito User Pool**
2. Create **Cognito Authorizer** in API Gateway
3. Attach to methods requiring authentication

## Deploy API

### Create Deployment
1. Click **Actions > Deploy API**
2. Deployment stage: `prod`
3. Stage description: `Production deployment`
4. Deploy

### Get API Endpoint
- After deployment, note the **Invoke URL**
- Format: `https://[api-id].execute-api.[region].amazonaws.com/prod`

## Usage Examples

### Frontend Integration
```javascript
const API_BASE_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod';

// Get latest sensor data
const getLatestSensorData = async () => {
  const response = await fetch(`${API_BASE_URL}/sensors/latest`);
  return response.json();
};

// Send control command
const sendControlCommand = async (command) => {
  const response = await fetch(`${API_BASE_URL}/controls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command)
  });
  return response.json();
};
```

## Monitoring and Logging
1. Enable **CloudWatch Logs** for API Gateway
2. Set up **CloudWatch Alarms** for error rates
3. Monitor **API Gateway Metrics** in CloudWatch
