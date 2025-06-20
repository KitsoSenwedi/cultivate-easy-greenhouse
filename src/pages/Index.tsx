
import React, { useState, useEffect } from 'react';
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
  Settings
} from 'lucide-react';
import SensorCard from '../components/SensorCard';
import AutomationControls from '../components/AutomationControls';
import GuidanceDashboard from '../components/GuidanceDashboard';
import AlertsPanel from '../components/AlertsPanel';

const Index = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 24.5,
    humidity: 65,
    soilMoisture: 78,
    lightLevel: 85,
    pestDetection: 'Low'
  });

  const [automationStatus, setAutomationStatus] = useState({
    irrigation: true,
    ventilation: true,
    pestControl: false,
    lighting: true
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: Math.max(18, Math.min(35, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        soilMoisture: Math.max(30, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        lightLevel: Math.max(0, Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 5)),
        pestDetection: Math.random() > 0.8 ? 'High' : Math.random() > 0.6 ? 'Medium' : 'Low'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
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
                value={`${sensorData.temperature.toFixed(1)}°C`}
                icon={<Thermometer className="h-5 w-5" />}
                status={sensorData.temperature > 30 ? 'warning' : 'normal'}
                optimal="20-26°C"
              />
              <SensorCard
                title="Humidity"
                value={`${sensorData.humidity.toFixed(0)}%`}
                icon={<Droplets className="h-5 w-5" />}
                status={sensorData.humidity < 50 ? 'warning' : 'normal'}
                optimal="60-70%"
              />
              <SensorCard
                title="Soil Moisture"
                value={`${sensorData.soilMoisture.toFixed(0)}%`}
                icon={<Sprout className="h-5 w-5" />}
                status={sensorData.soilMoisture < 40 ? 'critical' : 'normal'}
                optimal="70-80%"
              />
              <SensorCard
                title="Light Level"
                value={`${sensorData.lightLevel.toFixed(0)}%`}
                icon={<Sun className="h-5 w-5" />}
                status={sensorData.lightLevel < 40 ? 'warning' : 'normal'}
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
                      <span className="text-sm text-green-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
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
              sensorData={sensorData}
            />
          </TabsContent>

          <TabsContent value="guidance">
            <GuidanceDashboard sensorData={sensorData} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel sensorData={sensorData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
