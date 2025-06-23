
import { useState, useEffect } from 'react';
import { demoDataService, type SensorReading } from '../services/demoDataService';

export const useDemoSensorData = (intervalMs: number = 5000) => {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    console.log('🌱 Starting demo sensor data stream...');
    setIsConnected(true);

    // Generate initial reading
    const initialReading = demoDataService.generateSensorReading();
    setSensorData(initialReading);
    setLastUpdated(new Date());
    console.log('📊 Initial sensor reading:', initialReading);

    // Start continuous data stream
    const interval = demoDataService.startDataStream((reading) => {
      setSensorData(reading);
      setLastUpdated(new Date());
      console.log('🔄 New sensor reading:', reading);
    }, intervalMs);

    return () => {
      console.log('🛑 Stopping demo sensor data stream');
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [intervalMs]);

  return {
    sensorData,
    isConnected,
    lastUpdated,
    // Provide compatibility with existing component structure
    temperature: sensorData?.temperature || 0,
    humidity: sensorData?.humidity || 0,
    soilMoisture: sensorData?.soilMoisture || 0,
    lightLevel: sensorData?.lightLevel || 0,
    pestDetection: sensorData?.pestDetection || 'Low'
  };
};
