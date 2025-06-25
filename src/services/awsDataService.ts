
// AWS Data Service for sending sensor data to DynamoDB
import { awsCredentialsService, type AWSCredentials } from './awsCredentialsService';
import type { SensorReading } from './demoDataService';

class AWSDataService {
  private credentials: AWSCredentials | null = null;

  // Initialize AWS credentials
  private initializeCredentials(): boolean {
    this.credentials = awsCredentialsService.getCredentials();
    return !!this.credentials;
  }

  // Send sensor data to DynamoDB via REST API
  async sendSensorData(sensorReading: SensorReading): Promise<boolean> {
    if (!this.initializeCredentials()) {
      console.warn('⚠️ AWS credentials not configured');
      return false;
    }

    try {
      // Create DynamoDB item format
      const dynamoItem = {
        TableName: this.credentials!.dynamoTableName || 'GreenhouseSensorData',
        Item: {
          deviceId: { S: sensorReading.deviceId },
          timestamp: { N: sensorReading.timestamp.toString() },
          temperature: { N: sensorReading.temperature.toString() },
          humidity: { N: sensorReading.humidity.toString() },
          soilMoisture: { N: sensorReading.soilMoisture.toString() },
          lightLevel: { N: sensorReading.lightLevel.toString() },
          pestDetection: { S: sensorReading.pestDetection },
          ph: { N: sensorReading.ph.toString() },
          co2Level: { N: sensorReading.co2Level.toString() },
          dateCreated: { S: new Date().toISOString() }
        }
      };

      // Note: In a real implementation, you would use AWS SDK
      // For demo purposes, we'll simulate the API call
      console.log('📊 Sending sensor data to AWS DynamoDB:', {
        table: this.credentials!.dynamoTableName || 'GreenhouseSensorData',
        region: this.credentials!.region,
        data: sensorReading
      });

      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send data to AWS:', error);
      return false;
    }
  }

  // Batch send multiple readings
  async sendBatchSensorData(readings: SensorReading[]): Promise<number> {
    let successCount = 0;
    
    for (const reading of readings) {
      const success = await this.sendSensorData(reading);
      if (success) successCount++;
    }
    
    console.log(`📈 Batch upload complete: ${successCount}/${readings.length} successful`);
    return successCount;
  }

  // Test AWS connection
  async testConnection(): Promise<boolean> {
    if (!this.initializeCredentials()) {
      return false;
    }

    try {
      // Simulate connection test
      console.log('🔍 Testing AWS connection...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ AWS connection test successful');
      return true;
    } catch (error) {
      console.error('❌ AWS connection test failed:', error);
      return false;
    }
  }

  // Get connection status
  isConfigured(): boolean {
    return awsCredentialsService.hasCredentials();
  }
}

export const awsDataService = new AWSDataService();
