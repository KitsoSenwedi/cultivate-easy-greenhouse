
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  Bug, 
  Fan, 
  Sun, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  TrendingUp,
  Lightbulb,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';
import SensorCard from '../components/SensorCard';
import AutomationControls from '../components/AutomationControls';
import GuidanceDashboard from '../components/GuidanceDashboard';
import AlertsPanel from '../components/AlertsPanel';
import { useDemoSensorData } from '../hooks/useDemoSensorData';

const Index = () => {
  const { 
    sensorData, 
    isConnected, 
    lastUpdated,
    temperature,
    humidity,
    soilMoisture,
    lightLevel,
    pestDetection
  } = useDemoSensorData(3000); // Update every 3 seconds

  const [automationStatus, setAutomationStatus] = useState({
    irrigation: true,
    ventilation: true,
    pestControl: false,
    lighting: true
  });

  // Legacy format for existing components
  const legacySensorData = {
    temperature,
    humidity,
    soilMoisture,
    lightLevel,
    pestDetection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">GreenGrow Pro</h1>
                <p className="text-sm text-green-600">Automated Greenhouse Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`${
                isConnected 
                  ? 'bg-green-100 text-green-700 border-green-300' 
                  : 'bg-red-100 text-red-700 border-red-300'
              }`}>
                {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isConnected ? 'Demo Mode Active' : 'Disconnected'}
              </Badge>
              {lastUpdated && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  <Calendar className="h-3 w-3 mr-1" />
                  {lastUpdated.toLocaleTimeString()}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Demo Mode Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Demo Mode</h3>
              <p className="text-sm text-blue-600">
                Displaying simulated sensor data with realistic daily patterns. 
                {sensorData && (
                  <span className="ml-2 font-mono">
                    Device: {sensorData.deviceId} | pH: {sensorData.ph} | CO₂: {sensorData.co2Level} ppm
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Automation
            </TabsTrigger>
            <TabsTrigger value="guidance" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Guidance
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Real-time Sensor Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SensorCard
                title="Temperature"
                value={`${temperature.toFixed(1)}°C`}
                icon={<Thermometer className="h-5 w-5" />}
                status={temperature > 30 ? 'warning' : temperature < 18 ? 'critical' : 'normal'}
                optimal="20-26°C"
              />
              <SensorCard
                title="Humidity"
                value={`${humidity.toFixed(0)}%`}
                icon={<Droplets className="h-5 w-5" />}
                status={humidity < 50 || humidity > 80 ? 'warning' : 'normal'}
                optimal="60-70%"
              />
              <SensorCard
                title="Soil Moisture"
                value={`${soilMoisture.toFixed(0)}%`}
                icon={<Sprout className="h-5 w-5" />}
                status={soilMoisture < 40 ? 'critical' : soilMoisture < 60 ? 'warning' : 'normal'}
                optimal="70-80%"
              />
              <SensorCard
                title="Light Level"
                value={`${lightLevel.toFixed(0)}%`}
                icon={<Sun className="h-5 w-5" />}
                status={lightLevel < 40 ? 'warning' : 'normal'}
                optimal="80-90%"
              />
            </div>

            {/* System Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <TrendingUp className="h-5 w-5" />
                  <span>System Overview</span>
                </CardTitle>
                <CardDescription>Current greenhouse performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Overall Health</span>
                      <span className="text-sm text-green-600">
                        {Math.round((temperature > 18 && temperature < 30 ? 25 : 0) + 
                                   (humidity >= 50 && humidity <= 80 ? 25 : 0) + 
                                   (soilMoisture >= 40 ? 25 : 0) + 
                                   (lightLevel >= 40 ? 25 : 0))}%
                      </span>
                    </div>
                    <Progress value={Math.round((temperature > 18 && temperature < 30 ? 25 : 0) + 
                                                (humidity >= 50 && humidity <= 80 ? 25 : 0) + 
                                                (soilMoisture >= 40 ? 25 : 0) + 
                                                (lightLevel >= 40 ? 25 : 0))} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Automation Efficiency</span>
                      <span className="text-sm text-green-600">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Expected Yield</span>
                      <span className="text-sm text-green-600">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <AutomationControls 
              automationStatus={automationStatus}
              setAutomationStatus={setAutomationStatus}
              sensorData={legacySensorData}
            />
          </TabsContent>

          <TabsContent value="guidance">
            <GuidanceDashboard sensorData={legacySensorData} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel sensorData={legacySensorData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
