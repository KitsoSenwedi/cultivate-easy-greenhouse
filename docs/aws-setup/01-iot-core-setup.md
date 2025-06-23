
# AWS IoT Core Setup Guide

## Overview
AWS IoT Core will handle the communication between your greenhouse sensors and the cloud infrastructure.

## Step 1: Create an IoT Thing
1. Navigate to **AWS IoT Core** in the AWS Console
2. Go to **Manage > All devices > Things**
3. Click **Create things**
4. Choose **Create single thing**
5. Name your thing: `greenhouse-sensor-hub`
6. Leave thing type blank for now
7. Click **Next**

## Step 2: Configure Device Certificate
1. Choose **Auto-generate a new certificate**
2. Click **Next**
3. Create a new policy or attach existing policy (see Step 3)

## Step 3: Create IoT Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:YOUR_REGION:YOUR_ACCOUNT_ID:client/greenhouse-*",
        "arn:aws:iot:YOUR_REGION:YOUR_ACCOUNT_ID:topic/greenhouse/*",
        "arn:aws:iot:YOUR_REGION:YOUR_ACCOUNT_ID:topicfilter/greenhouse/*"
      ]
    }
  ]
}
```

## Step 4: Download Certificates
- Download the device certificate (.pem.crt)
- Download the private key (.pem.key)
- Download the root CA certificate

## Step 5: Create IoT Rules
1. Go to **Message routing > Rules**
2. Create rule: `ProcessGreenhouseData`
3. SQL statement:
```sql
SELECT *, timestamp() as timestamp FROM 'greenhouse/sensors'
```
4. Add actions:
   - Send to Lambda function
   - Send to DynamoDB table

## Topic Structure
- `greenhouse/sensors` - All sensor data
- `greenhouse/controls` - Control commands
- `greenhouse/status` - System status updates

## Sample Sensor Data Format
```json
{
  "deviceId": "greenhouse-01",
  "timestamp": 1640995200,
  "temperature": 24.5,
  "humidity": 65,
  "soilMoisture": 78,
  "lightLevel": 85,
  "pestDetection": "low"
}
```
