
# Complete AWS Integration Guide

## Overview
This guide ties together all AWS services for your greenhouse IoT system.

## Architecture Summary

```
[Greenhouse Sensors] 
    ↓ (MQTT/WiFi)
[AWS IoT Core] 
    ↓ (Rules Engine)
[Lambda Functions] 
    ↓ (Process & Store)
[DynamoDB + S3] 
    ↓ (API Gateway)
[React Frontend] 
    ↓ (Amplify Hosting)
[Users/Farmers]
```

## Step-by-Step Implementation

### Phase 1: Core Infrastructure (Week 1)
1. **Set up IoT Core** (Day 1-2)
   - Create Thing Registry
   - Configure certificates
   - Set up topic structure

2. **Deploy Lambda Functions** (Day 3-4)
   - Process sensor data
   - Automation triggers
   - API handlers

3. **Configure DynamoDB** (Day 5)
   - Create tables
   - Set up indexes
   - Configure TTL

### Phase 2: Data Processing (Week 2)
1. **S3 Storage Setup** (Day 6-7)
   - Historical data buckets
   - Lifecycle policies
   - Backup configurations

2. **API Gateway** (Day 8-9)
   - REST endpoints
   - CORS configuration
   - Authentication setup

3. **Testing Integration** (Day 10)
   - End-to-end data flow
   - Error handling
   - Performance testing

### Phase 3: Analytics & Frontend (Week 3)
1. **QuickSight Setup** (Day 11-12)
   - Data sources
   - Dashboards
   - Automated reports

2. **Amplify Deployment** (Day 13-14)
   - Frontend hosting
   - CI/CD pipeline
   - Domain configuration

3. **Final Integration** (Day 15)
   - Frontend-backend connection
   - User testing
   - Documentation

## Frontend Integration Code

### AWS SDK Configuration
```javascript
// src/config/aws-config.js
export const awsConfig = {
  region: process.env.VITE_AWS_REGION,
  apiGateway: {
    baseUrl: process.env.VITE_API_GATEWAY_URL
  },
  iot: {
    endpoint: process.env.VITE_IOT_ENDPOINT
  }
};
```

### Real-time Data Hook
```javascript
// src/hooks/useRealTimeData.js
import { useState, useEffect } from 'react';
import { awsConfig } from '../config/aws-config';

export const useRealTimeData = () => {
  const [sensorData, setSensorData] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch(`${awsConfig.apiGateway.baseUrl}/sensors/latest`);
        const data = await response.json();
        setSensorData(data);
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchLatestData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchLatestData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { sensorData, isConnected };
};
```

### Control Commands Service
```javascript
// src/services/controlService.js
import { awsConfig } from '../config/aws-config';

export const controlService = {
  async sendIrrigationCommand(deviceId, duration) {
    const command = {
      action: 'irrigate',
      duration: duration,
      zone: deviceId,
      timestamp: Date.now()
    };

    const response = await fetch(`${awsConfig.apiGateway.baseUrl}/controls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });

    return response.json();
  },

  async sendVentilationCommand(deviceId, intensity) {
    const command = {
      action: 'ventilate',
      intensity: intensity,
      zone: deviceId,
      timestamp: Date.now()
    };

    const response = await fetch(`${awsConfig.apiGateway.baseUrl}/controls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });

    return response.json();
  }
};
```

## Cost Estimation

### Monthly AWS Costs (Estimated)
- **IoT Core**: $5-15 (1M messages)
- **Lambda**: $10-20 (1M requests)
- **DynamoDB**: $15-30 (On-demand)
- **S3**: $5-10 (100GB storage)
- **API Gateway**: $3-7 (1M requests)
- **QuickSight**: $18+ (Standard edition)
- **Amplify**: $15+ (Build minutes + hosting)

**Total: ~$70-120/month** for moderate usage

### Cost Optimization Tips
1. Use DynamoDB auto-scaling
2. Set up S3 lifecycle policies
3. Optimize Lambda memory allocation
4. Use CloudWatch to monitor unused resources
5. Set up billing alerts

## Security Best Practices

### IoT Device Security
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": "arn:aws:iot:region:account:client/${iot:ClientId}",
      "Condition": {
        "StringEquals": {
          "iot:ClientId": "${iot:Certificate.Subject.CommonName}"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": "arn:aws:iot:region:account:topic/greenhouse/${iot:ClientId}/*"
    }
  ]
}
```

### API Security
- Enable **AWS WAF** on API Gateway
- Use **API Keys** for rate limiting
- Implement **JWT authentication**
- Set up **CORS** properly

### Data Protection
- Enable **DynamoDB encryption**
- Use **S3 bucket encryption**
- Set up **CloudTrail** for auditing
- Implement **VPC endpoints** for private communication

## Monitoring and Alerts

### CloudWatch Metrics
```javascript
// Custom metrics for greenhouse monitoring
const publishMetric = async (metricName, value, unit = 'Count') => {
  const cloudwatch = new AWS.CloudWatch();
  
  const params = {
    Namespace: 'Greenhouse/Sensors',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date()
      }
    ]
  };
  
  await cloudwatch.putMetricData(params).promise();
};
```

### SNS Alerts Setup
```json
{
  "Type": "AWS::SNS::Topic",
  "Properties": {
    "TopicName": "GreenhouseAlerts",
    "Subscription": [
      {
        "Protocol": "email",
        "Endpoint": "farmer@greenhouse.com"
      },
      {
        "Protocol": "sms",
        "Endpoint": "+1234567890"
      }
    ]
  }
}
```

## Backup and Disaster Recovery

### Automated Backups
1. **DynamoDB**: Enable point-in-time recovery
2. **S3**: Cross-region replication
3. **Lambda**: Version control and aliases
4. **IoT**: Certificate backup

### Recovery Procedures
1. Document all configurations
2. Use Infrastructure as Code (CloudFormation)
3. Test recovery procedures quarterly
4. Maintain offline documentation

## Next Steps

1. **Test the complete setup** with simulated sensor data
2. **Deploy gradually** - start with one greenhouse zone
3. **Monitor performance** and optimize as needed
4. **Scale up** to additional greenhouse zones
5. **Add machine learning** for predictive analytics
6. **Implement mobile app** for field workers

## Support Resources

- **AWS IoT Documentation**: https://docs.aws.amazon.com/iot/
- **Greenhouse IoT Patterns**: AWS IoT Core Device SDK
- **Community Forums**: AWS Developer Forums
- **Professional Support**: Consider AWS Support plans for production systems
