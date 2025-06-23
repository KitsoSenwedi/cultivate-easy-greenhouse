
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Fan, 
  Bug, 
  Sun, 
  Settings, 
  Activity,
  Zap
} from 'lucide-react';

interface AutomationControlsProps {
  automationStatus: {
    irrigation: boolean;
    ventilation: boolean;
    pestControl: boolean;
    lighting: boolean;
  };
  setAutomationStatus: React.Dispatch<React.SetStateAction<{
    irrigation: boolean;
    ventilation: boolean;
    pestControl: boolean;
    lighting: boolean;
  }>>;
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
    pestDetection: string;
  };
  onManualAction?: (action: string) => void;
}

const AutomationControls = ({ automationStatus, setAutomationStatus, sensorData, onManualAction }: AutomationControlsProps) => {
  const toggleAutomation = (system: keyof typeof automationStatus) => {
    setAutomationStatus(prev => ({
      ...prev,
      [system]: !prev[system]
    }));
  };

  const handleManualAction = (action: string) => {
    if (onManualAction) {
      onManualAction(action);
    }
  };

  const automationSystems = [
    {
      id: 'irrigation' as const,
      title: 'Smart Irrigation',
      description: 'AI-powered watering based on soil moisture and weather',
      icon: <Droplets className="h-5 w-5" />,
      active: automationStatus.irrigation,
      status: sensorData.soilMoisture < 40 ? 'Active - Watering Zone A' : 'Monitoring All Zones',
      color: sensorData.soilMoisture < 40 ? 'text-blue-600' : 'text-green-600'
    },
    {
      id: 'ventilation' as const,
      title: 'Climate Control',
      description: 'Automatic temperature and humidity regulation',
      icon: <Fan className="h-5 w-5" />,
      active: automationStatus.ventilation,
      status: sensorData.temperature > 26 ? 'Active - Cooling Zone B' : 'Optimal Temperature',
      color: sensorData.temperature > 26 ? 'text-blue-600' : 'text-green-600'
    },
    {
      id: 'pestControl' as const,
      title: 'Pest Management',
      description: 'AI detection and targeted pest control measures',
      icon: <Bug className="h-5 w-5" />,
      active: automationStatus.pestControl,
      status: sensorData.pestDetection === 'High' ? 'Active - Treating Zone C' : 'Monitoring All Areas',
      color: sensorData.pestDetection === 'High' ? 'text-red-600' : 'text-green-600'
    },
    {
      id: 'lighting' as const,
      title: 'Smart Lighting',
      description: 'Automated grow lights based on natural light levels',
      icon: <Sun className="h-5 w-5" />,
      active: automationStatus.lighting,
      status: sensorData.lightLevel < 50 ? 'Active - Supplementing Zone D' : 'Natural Light Sufficient',
      color: sensorData.lightLevel < 50 ? 'text-yellow-600' : 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Automation Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Zap className="h-5 w-5" />
            <span>Automation Status</span>
          </CardTitle>
          <CardDescription>
            AI-powered systems automatically managing your greenhouse environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationSystems.map((system) => (
              <div key={system.id} className="p-4 border border-green-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded">
                      {system.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{system.title}</h3>
                      <p className="text-sm text-gray-500">{system.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={system.active}
                    onCheckedChange={() => toggleAutomation(system.id)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`${system.color} border-current`}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {system.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Manual Override</CardTitle>
          <CardDescription>
            Emergency controls for immediate system adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleManualAction('Water Zone A')}
            >
              <Droplets className="h-5 w-5" />
              <span className="text-sm">Water Zone A</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleManualAction('Ventilate Zone B')}
            >
              <Fan className="h-5 w-5" />
              <span className="text-sm">Ventilate Zone B</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleManualAction('Pest Spray Zone C')}
            >
              <Bug className="h-5 w-5" />
              <span className="text-sm">Spray Zone C</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleManualAction('Lights Zone D')}
            >
              <Sun className="h-5 w-5" />
              <span className="text-sm">Lights Zone D</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationControls;
