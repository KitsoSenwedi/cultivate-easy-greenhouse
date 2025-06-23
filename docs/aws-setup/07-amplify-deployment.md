
# AWS Amplify Deployment Guide

## Overview
AWS Amplify will host your React frontend and provide CI/CD capabilities.

## Prerequisites
- GitHub repository with your React code
- AWS CLI configured
- Amplify CLI installed

## Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

## Step 2: Initialize Amplify Project

### In your React project directory:
```bash
amplify init
```

### Configuration prompts:
- Project name: `greenhouse-dashboard`
- Environment name: `dev`
- Default editor: Your preferred editor
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Build directory: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`

## Step 3: Add Hosting

```bash
amplify add hosting
```

Choose options:
- Hosting with Amplify Console
- Manual deployment

## Step 4: Environment Configuration

### Add environment variables in Amplify Console:
```
VITE_AWS_REGION=us-east-1
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
VITE_IOT_ENDPOINT=your-iot-endpoint.iot.us-east-1.amazonaws.com
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 5: Update Build Settings

### amplify.yml configuration:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 6: Connect to GitHub

### In Amplify Console:
1. Choose **Host web app**
2. Select **GitHub**
3. Authorize Amplify to access your repository
4. Choose repository and branch
5. Configure build settings
6. Review and save

### Automatic deployments:
- Pushes to main branch trigger builds
- Pull requests create preview environments
- Build status appears in GitHub

## Step 7: Add Authentication (Optional)

```bash
amplify add auth
```

Configuration:
- Default configuration
- Username
- No additional attributes needed initially

### Update your React components:
```javascript
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);
```

## Step 8: Add API Integration

```bash
amplify add api
```

Choose:
- REST API
- Create new Lambda function or use existing
- Path: `/api`

### API Configuration
```javascript
// In your React app
import { API } from 'aws-amplify';

const apiName = 'GreenhouseAPI';
const path = '/sensors/latest';

const getSensorData = async () => {
  try {
    const data = await API.get(apiName, path);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

## Step 9: Performance Optimization

### Add caching headers in amplify.yml:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
customHeaders:
  - pattern: '*.js'
    headers:
      - key: 'Cache-Control'
        value: 'public, max-age=31536000'
  - pattern: '*.css'
    headers:
      - key: 'Cache-Control'
        value: 'public, max-age=31536000'
  - pattern: '*.json'
    headers:
      - key: 'Cache-Control'
        value: 'public, max-age=86400'
```

## Step 10: Domain Configuration

### Custom domain setup:
1. Go to **Domain management** in Amplify Console
2. Click **Add domain**
3. Enter your domain (e.g., greenhouse.yourdomain.com)
4. Amplify will create SSL certificate automatically
5. Update DNS records as instructed

### SSL Certificate:
- Automatically provisioned by Amplify
- Renews automatically
- Covers all subdomains if wildcard

## Step 11: Monitoring and Analytics

### CloudWatch Integration:
```javascript
// Add to your React app
import { Analytics } from 'aws-amplify';

// Track user interactions
Analytics.record({
  name: 'sensorDataViewed',
  attributes: {
    deviceId: 'greenhouse-01',
    timestamp: new Date().toISOString()
  }
});
```

### Performance Monitoring:
1. Enable **Real User Monitoring** in Amplify
2. Set up **CloudWatch Alarms** for:
   - Build failures
   - High error rates
   - Performance degradation

## Step 12: Multi-Environment Setup

### Create staging environment:
```bash
amplify env add staging
```

### Environment-specific configs:
- `amplify/.config/project-config.json`
- Different API endpoints per environment
- Separate databases and resources

## Deployment Commands

### Deploy to current environment:
```bash
amplify publish
```

### Deploy specific environment:
```bash
amplify publish --environment production
```

### Check deployment status:
```bash
amplify status
```

## Troubleshooting

### Common issues:
1. **Build failures**: Check build logs in Amplify Console
2. **Environment variables**: Ensure all required vars are set
3. **CORS errors**: Verify API Gateway CORS configuration
4. **Authentication issues**: Check Cognito configuration

### Debug build locally:
```bash
amplify mock
```

This creates a local development environment matching your cloud setup.
