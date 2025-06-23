
# DynamoDB Setup Guide

## Overview
DynamoDB will store real-time sensor data and system configurations.

## Table 1: GreenhouseSensorData

### Create Table
1. Go to **DynamoDB** in AWS Console
2. Click **Create table**
3. Table name: `GreenhouseSensorData`
4. Partition key: `deviceId` (String)
5. Sort key: `timestamp` (Number)
6. Click **Create table**

### Add Global Secondary Index
1. Go to table details
2. Click **Indexes** tab
3. Click **Create index**
4. Partition key: `timestamp` (Number)
5. Index name: `timestamp-index`
6. Create index

### Sample Item Structure
```json
{
  "deviceId": "greenhouse-01",
  "timestamp": 1640995200000,
  "temperature": 24.5,
  "humidity": 65,
  "soilMoisture": 78,
  "lightLevel": 85,
  "pestDetection": "low",
  "ttl": 1643587200
}
```

## Table 2: GreenhouseConfig

### Create Table
1. Table name: `GreenhouseConfig`
2. Partition key: `configType` (String)
3. Sort key: `deviceId` (String)

### Sample Configuration Items
```json
{
  "configType": "automation",
  "deviceId": "greenhouse-01",
  "irrigationThreshold": 40,
  "temperatureThreshold": 30,
  "humidityRange": {
    "min": 60,
    "max": 80
  },
  "lightThreshold": 50,
  "automationEnabled": true
}
```

## Table 3: GreenhouseAlerts

### Create Table
1. Table name: `GreenhouseAlerts`
2. Partition key: `alertId` (String)
3. Sort key: `timestamp` (Number)

### Sample Alert Items
```json
{
  "alertId": "alert-001",
  "timestamp": 1640995200000,
  "deviceId": "greenhouse-01",
  "alertType": "critical",
  "message": "Soil moisture critically low",
  "acknowledged": false,
  "ttl": 1641081600
}
```

## Enable TTL (Time To Live)
1. Go to each table
2. Click **Additional settings**
3. Enable TTL
4. TTL attribute name: `ttl`
5. This automatically deletes old data to manage costs

## IAM Permissions
Create an IAM role with these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/GreenhouseSensorData",
                "arn:aws:dynamodb:*:*:table/GreenhouseSensorData/*",
                "arn:aws:dynamodb:*:*:table/GreenhouseConfig",
                "arn:aws:dynamodb:*:*:table/GreenhouseAlerts"
            ]
        }
    ]
}
```
