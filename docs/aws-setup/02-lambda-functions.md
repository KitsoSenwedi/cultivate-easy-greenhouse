
# AWS Lambda Functions Setup Guide

## Overview
Lambda functions will process incoming sensor data and trigger automated responses.

## Function 1: Process Sensor Data

### Create Function
1. Go to **AWS Lambda** in the console
2. Click **Create function**
3. Choose **Author from scratch**
4. Function name: `processSensorData`
5. Runtime: **Node.js 18.x** or **Python 3.9**
6. Create function

### Function Code (Node.js)
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const iot = new AWS.Iot();

exports.handler = async (event) => {
    console.log('Received sensor data:', JSON.stringify(event, null, 2));
    
    try {
        // Store in DynamoDB
        const params = {
            TableName: 'GreenhouseSensorData',
            Item: {
                deviceId: event.deviceId,
                timestamp: event.timestamp || Date.now(),
                temperature: event.temperature,
                humidity: event.humidity,
                soilMoisture: event.soilMoisture,
                lightLevel: event.lightLevel,
                pestDetection: event.pestDetection,
                ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
            }
        };
        
        await dynamodb.put(params).promise();
        
        // Check for automation triggers
        await checkAutomationTriggers(event);
        
        return {
            statusCode: 200,
            body: JSON.stringify('Data processed successfully')
        };
    } catch (error) {
        console.error('Error processing sensor data:', error);
        throw error;
    }
};

async function checkAutomationTriggers(sensorData) {
    const iotdata = new AWS.IotData({
        endpoint: process.env.IOT_ENDPOINT
    });
    
    // Irrigation trigger
    if (sensorData.soilMoisture < 40) {
        const controlMessage = {
            action: 'irrigate',
            duration: 300, // 5 minutes
            zone: sensorData.deviceId
        };
        
        await iotdata.publish({
            topic: 'greenhouse/controls',
            payload: JSON.stringify(controlMessage)
        }).promise();
    }
    
    // Temperature control
    if (sensorData.temperature > 30) {
        const controlMessage = {
            action: 'ventilate',
            intensity: 'high',
            zone: sensorData.deviceId
        };
        
        await iotdata.publish({
            topic: 'greenhouse/controls',
            payload: JSON.stringify(controlMessage)
        }).promise();
    }
}
```

### Environment Variables
- `IOT_ENDPOINT`: Your IoT Core endpoint
- `DYNAMODB_TABLE`: `GreenhouseSensorData`

### IAM Role Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/GreenhouseSensorData"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iot:Publish"
            ],
            "Resource": "arn:aws:iot:*:*:topic/greenhouse/*"
        }
    ]
}
```

## Function 2: API Gateway Handler

### Create Function
- Function name: `greenhouseApiHandler`
- Runtime: **Node.js 18.x**

### Function Code
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };
    
    try {
        const path = event.path;
        const method = event.httpMethod;
        
        if (method === 'GET' && path === '/sensors/latest') {
            return await getLatestSensorData();
        } else if (method === 'GET' && path === '/sensors/history') {
            return await getSensorHistory(event.queryStringParameters);
        } else if (method === 'POST' && path === '/controls') {
            return await sendControlCommand(JSON.parse(event.body));
        }
        
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function getLatestSensorData() {
    const params = {
        TableName: 'GreenhouseSensorData',
        IndexName: 'timestamp-index',
        KeyConditionExpression: 'deviceId = :deviceId',
        ExpressionAttributeValues: {
            ':deviceId': 'greenhouse-01'
        },
        ScanIndexForward: false,
        Limit: 1
    };
    
    const result = await dynamodb.query(params).promise();
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Items[0] || {})
    };
}
```
