
# AWS QuickSight Setup Guide

## Overview
QuickSight will provide analytics and visualization for your greenhouse data.

## Prerequisites
1. Ensure DynamoDB tables are populated with data
2. Have S3 bucket with historical data
3. QuickSight service activated in your account

## Step 1: Activate QuickSight

### Sign up for QuickSight
1. Go to **QuickSight** in AWS Console
2. Click **Sign up for QuickSight**
3. Choose **Standard Edition** (or Enterprise for advanced features)
4. Account name: `greenhouse-analytics`
5. Notification email: Your email
6. Choose region same as your other services
7. Click **Finish**

## Step 2: Set Up Data Sources

### Data Source 1: DynamoDB
1. Click **Datasets** in QuickSight
2. Click **New dataset**
3. Choose **AWS IoT Analytics** or create custom connector
4. For DynamoDB, use **Athena** as intermediate service:

#### Set up Athena for DynamoDB
```sql
CREATE EXTERNAL TABLE greenhouse_sensor_data (
  deviceId string,
  timestamp bigint,
  temperature double,
  humidity double,
  soilMoisture double,
  lightLevel double,
  pestDetection string
)
STORED BY 'org.apache.hadoop.hive.dynamodb.DynamoDBStorageHandler'
TBLPROPERTIES (
  "dynamodb.table.name" = "GreenhouseSensorData",
  "dynamodb.column.mapping" = "deviceId:deviceId,timestamp:timestamp,temperature:temperature,humidity:humidity,soilMoisture:soilMoisture,lightLevel:lightLevel,pestDetection:pestDetection"
);
```

### Data Source 2: S3 Historical Data
1. Create new dataset
2. Choose **S3**
3. Data source name: `greenhouse-historical`
4. S3 URL: `s3://greenhouse-historical-data-[account]/sensor-data/`
5. Upload manifest file or auto-detect

#### S3 Manifest File
```json
{
  "fileLocations": [
    {
      "URIPrefixes": [
        "s3://greenhouse-historical-data-[account]/sensor-data/"
      ]
    }
  ],
  "globalUploadSettings": {
    "format": "JSON",
    "delimiter": ",",
    "textqualifier": "\"",
    "containsHeader": "true"
  }
}
```

## Step 3: Create Calculated Fields

### Temperature Trend
```
periodOverPeriodDifference(
  avg(temperature),
  [timestamp],
  HOUR,
  1
)
```

### Irrigation Efficiency
```
countIf(soilMoisture >= 70) / count(soilMoisture) * 100
```

### Daily Water Usage
```
sumIf(irrigationAmount, timestamp >= truncDate('DD', now()) AND timestamp < addDateTime(1, 'DD', truncDate('DD', now())))
```

### Pest Risk Score
```
ifelse(
  pestDetection = 'High', 3,
  pestDetection = 'Medium', 2,
  pestDetection = 'Low', 1,
  0
)
```

## Step 4: Create Visualizations

### Dashboard 1: Real-time Monitoring

#### Temperature & Humidity Trends
1. Visual type: **Line chart**
2. X-axis: `timestamp` (hour granularity)
3. Value: `temperature`, `humidity`
4. Color: Field name

#### Soil Moisture Gauge
1. Visual type: **Gauge**
2. Value: `avg(soilMoisture)`
3. Target value: 75
4. Conditional formatting:
   - Red: < 40
   - Yellow: 40-60
   - Green: > 60

#### Pest Detection Pie Chart
1. Visual type: **Pie chart**
2. Group: `pestDetection`
3. Value: `count()`

### Dashboard 2: Historical Analysis

#### Monthly Water Usage
1. Visual type: **Bar chart**
2. X-axis: `timestamp` (month granularity)
3. Value: `sum(irrigationAmount)`

#### Crop Health Score
1. Visual type: **Line chart**
2. X-axis: `timestamp` (day granularity)
3. Value: Calculated field for health score

#### Yield Prediction
1. Visual type: **Combo chart**
2. Bars: Actual yield
3. Line: Predicted yield (from ML model)

## Step 5: Set Up Automated Reports

### Daily Report
1. Go to **Dashboards**
2. Click on your dashboard
3. Click **Schedule email reports**
4. Frequency: **Daily**
5. Time: 8:00 AM
6. Recipients: Farm managers
7. Format: PDF

### Weekly Summary
1. Create weekly schedule
2. Include:
   - Water usage summary
   - Pest activity report
   - Environmental conditions
   - Yield projections

## Step 6: Create Alerts

### Threshold Alerts
1. Click **Insights** in dashboard
2. Set up **Anomaly detection**
3. Configure thresholds:
   - Temperature > 35°C
   - Soil moisture < 30%
   - Pest detection = 'High'

### Alert Configuration
```json
{
  "alertName": "CriticalGreenhouseConditions",
  "thresholds": [
    {
      "metric": "temperature",
      "operator": ">",
      "value": 35,
      "severity": "critical"
    },
    {
      "metric": "soilMoisture",
      "operator": "<",
      "value": 30,
      "severity": "critical"
    }
  ],
  "notifications": {
    "email": ["farmer@greenhouse.com"],
    "sns": "arn:aws:sns:region:account:greenhouse-alerts"
  }
}
```

## Step 7: Mobile Optimization

### Mobile Dashboard
1. Create separate dashboard for mobile
2. Use **KPI** visuals for key metrics
3. Simplify charts for mobile viewing
4. Enable **QuickSight Mobile App** access

## Cost Optimization

### Reader Sessions
- Use **Reader** accounts for view-only access
- Limit **Author** accounts to data analysts

### Data Refresh Schedule
- Set appropriate refresh frequencies
- Use incremental refresh where possible
- Archive old visualizations

## Sample QuickSight Calculations

### Growing Degree Days
```
sumOver(
  maxOver([temperature - 10, 0], [timestamp], PRE_AGG),
  [timestamp],
  [{timestamp} ASC],
  [{timestamp} ASC]
)
```

### Irrigation Effectiveness
```
avg(soilMoisture) - lag(avg(soilMoisture), [timestamp], 1, [deviceId])
```
