
# Amazon S3 Setup Guide

## Overview
S3 will store historical data, analytics reports, and system backups.

## Bucket 1: Greenhouse Historical Data

### Create Bucket
1. Go to **S3** in AWS Console
2. Click **Create bucket**
3. Bucket name: `greenhouse-historical-data-[your-account-id]`
4. Region: Choose your preferred region
5. Keep default settings for now
6. Click **Create bucket**

### Folder Structure
```
greenhouse-historical-data/
├── sensor-data/
│   ├── year=2024/
│   │   ├── month=01/
│   │   │   ├── day=01/
│   │   │   │   └── sensor-data-20240101.json
├── analytics/
│   ├── daily-reports/
│   ├── weekly-reports/
│   └── monthly-reports/
├── backups/
│   ├── configurations/
│   └── system-state/
└── images/
    ├── plant-growth/
    └── pest-detection/
```

### Lifecycle Policy
1. Go to bucket **Management** tab
2. Click **Create lifecycle rule**
3. Rule name: `ArchiveOldData`
4. Apply to entire bucket
5. Transitions:
   - Move to IA after 30 days
   - Move to Glacier after 90 days
   - Delete after 7 years

### Sample Lifecycle Configuration
```json
{
    "Rules": [
        {
            "ID": "GreenhouseDataLifecycle",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "sensor-data/"
            },
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                }
            ],
            "Expiration": {
                "Days": 2555
            }
        }
    ]
}
```

## Bucket 2: Application Assets

### Create Bucket
1. Bucket name: `greenhouse-app-assets-[your-account-id]`
2. Enable static website hosting
3. Index document: `index.html`
4. Error document: `error.html`

### CORS Configuration
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### Bucket Policy for Public Read
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::greenhouse-app-assets-[your-account-id]/*"
        }
    ]
}
```

## Lambda Function for S3 Data Processing

### Function: processHistoricalData
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    // Triggered daily to aggregate and store historical data
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const key = `sensor-data/year=${year}/month=${month}/day=${day}/sensor-data-${year}${month}${day}.json`;
    
    // Get data from DynamoDB and aggregate
    const aggregatedData = await getAggregatedData(date);
    
    const params = {
        Bucket: 'greenhouse-historical-data-[your-account-id]',
        Key: key,
        Body: JSON.stringify(aggregatedData),
        ContentType: 'application/json'
    };
    
    await s3.putObject(params).promise();
    
    return { statusCode: 200, body: 'Data archived successfully' };
};
```

## IAM Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::greenhouse-historical-data-*",
                "arn:aws:s3:::greenhouse-historical-data-*/*",
                "arn:aws:s3:::greenhouse-app-assets-*",
                "arn:aws:s3:::greenhouse-app-assets-*/*"
            ]
        }
    ]
}
```
