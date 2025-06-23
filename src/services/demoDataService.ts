
// Demo data service to simulate realistic greenhouse sensor readings
export interface SensorReading {
  deviceId: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
  pestDetection: 'Low' | 'Medium' | 'High';
  ph: number;
  co2Level: number;
}

class DemoDataService {
  private baseTemperature = 22;
  private baseHumidity = 60;
  private baseSoilMoisture = 70;
  private baseLightLevel = 80;
  private timeOfDay = 0;

  // Simulate daily cycles (temperature rises during day, falls at night)
  private getDailyTemperatureCycle(): number {
    const hour = new Date().getHours();
    const dayTemperatureBoost = Math.sin((hour - 6) * Math.PI / 12) * 8;
    return Math.max(18, this.baseTemperature + dayTemperatureBoost + (Math.random() - 0.5) * 2);
  }

  // Simulate humidity inverse relationship with temperature
  private getHumidity(temperature: number): number {
    const humidityAdjustment = (temperature - 22) * -1.5;
    return Math.max(30, Math.min(90, this.baseHumidity + humidityAdjustment + (Math.random() - 0.5) * 5));
  }

  // Simulate soil moisture depletion over time
  private getSoilMoisture(): number {
    // Soil moisture decreases by 0.5% every hour, irrigation brings it back up
    const hoursSinceLastWatering = Math.random() * 12;
    const moistureDepletion = hoursSinceLastWatering * 0.5;
    return Math.max(20, this.baseSoilMoisture - moistureDepletion + (Math.random() - 0.5) * 3);
  }

  // Simulate light levels based on time of day
  private getLightLevel(): number {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
      // Daytime - higher light levels
      const dayLightCycle = Math.sin((hour - 6) * Math.PI / 12) * 40;
      return Math.max(20, 60 + dayLightCycle + (Math.random() - 0.5) * 10);
    } else {
      // Nighttime - artificial lighting or very low
      return Math.max(0, 15 + (Math.random() - 0.5) * 10);
    }
  }

  // Simulate pest detection based on environmental conditions
  private getPestDetection(temperature: number, humidity: number): 'Low' | 'Medium' | 'High' {
    const pestRisk = (temperature > 28 ? 0.3 : 0) + (humidity > 80 ? 0.4 : 0) + (Math.random() * 0.3);
    
    if (pestRisk > 0.6) return 'High';
    if (pestRisk > 0.3) return 'Medium';
    return 'Low';
  }

  // Generate a complete sensor reading
  generateSensorReading(deviceId: string = 'greenhouse-01'): SensorReading {
    const temperature = this.getDailyTemperatureCycle();
    const humidity = this.getHumidity(temperature);
    const soilMoisture = this.getSoilMoisture();
    const lightLevel = this.getLightLevel();
    const pestDetection = this.getPestDetection(temperature, humidity);

    return {
      deviceId,
      timestamp: Date.now(),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity),
      soilMoisture: Math.round(soilMoisture),
      lightLevel: Math.round(lightLevel),
      pestDetection,
      ph: Math.round((6.5 + (Math.random() - 0.5) * 1) * 10) / 10,
      co2Level: Math.round(400 + (Math.random() - 0.5) * 200)
    };
  }

  // Generate historical data for testing
  generateHistoricalData(hours: number = 24): SensorReading[] {
    const data: SensorReading[] = [];
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;

    for (let i = hours; i >= 0; i--) {
      const timestamp = now - (i * hourMs);
      const reading = this.generateSensorReading();
      reading.timestamp = timestamp;
      data.push(reading);
    }

    return data;
  }

  // Simulate AWS IoT message format
  generateIoTMessage(deviceId: string = 'greenhouse-01') {
    const reading = this.generateSensorReading(deviceId);
    
    return {
      topic: `greenhouse/sensors`,
      payload: {
        ...reading,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        qos: 1,
        retain: false
      }
    };
  }

  // Start continuous data generation (for real-time simulation)
  startDataStream(callback: (data: SensorReading) => void, intervalMs: number = 5000) {
    return setInterval(() => {
      const reading = this.generateSensorReading();
      callback(reading);
    }, intervalMs);
  }
}

export const demoDataService = new DemoDataService();
