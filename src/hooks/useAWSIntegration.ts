
import { useState, useEffect } from 'react';
import { awsDataService } from '../services/awsDataService';
import { awsCredentialsService } from '../services/awsCredentialsService';
import type { SensorReading } from '../services/demoDataService';

export const useAWSIntegration = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    // Check configuration status on mount and when localStorage changes
    const checkConfig = () => {
      setIsConfigured(awsDataService.isConfigured());
    };

    checkConfig();
    
    // Listen for localStorage changes
    window.addEventListener('storage', checkConfig);
    return () => window.removeEventListener('storage', checkConfig);
  }, []);

  const uploadSensorData = async (sensorReading: SensorReading): Promise<boolean> => {
    if (!isConfigured) {
      console.warn('⚠️ AWS not configured, skipping upload');
      return false;
    }

    setIsUploading(true);
    try {
      const success = await awsDataService.sendSensorData(sensorReading);
      if (success) {
        setUploadCount(prev => prev + 1);
      }
      return success;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadBatchData = async (readings: SensorReading[]): Promise<number> => {
    if (!isConfigured) {
      console.warn('⚠️ AWS not configured, skipping batch upload');
      return 0;
    }

    setIsUploading(true);
    try {
      const successCount = await awsDataService.sendBatchSensorData(readings);
      setUploadCount(prev => prev + successCount);
      return successCount;
    } finally {
      setIsUploading(false);
    }
  };

  const testConnection = async (): Promise<boolean> => {
    return await awsDataService.testConnection();
  };

  return {
    isConfigured,
    isUploading,
    uploadCount,
    uploadSensorData,
    uploadBatchData,
    testConnection
  };
};
