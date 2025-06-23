
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Bell,
  X,
  Clock
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AlertsPanelProps {
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
    pestDetection: string;
  };
}

const AlertsPanel = ({ sensorData }: AlertsPanelProps) => {
  const { toast } = useToast();

  const generateAlerts = () => {
    const alerts = [];
    
    if (sensorData.soilMoisture < 40) {
      alerts.push({
        id: 1,
        type: 'critical',
        title: 'Critical Soil Moisture - Zone A',
        message: `Tomato plants in Zone A showing stress. Soil moisture at ${sensorData.soilMoisture.toFixed(0)}%. Immediate watering required to prevent wilting.`,
        time: '2 minutes ago',
        action: 'Water Zone A',
        zone: 'Zone A',
        plant: 'Tomatoes'
      });
    }

    if (sensorData.temperature > 30) {
      alerts.push({
        id: 2,
        type: 'warning',
        title: 'High Temperature - Zone B',
        message: `Lettuce crops in Zone B experiencing heat stress at ${sensorData.temperature.toFixed(1)}°C. Recommended maximum is 25°C for leafy greens.`,
        time: '5 minutes ago',
        action: 'Cool Zone B',
        zone: 'Zone B',
        plant: 'Lettuce'
      });
    }

    if (sensorData.pestDetection === 'High') {
      alerts.push({
        id: 3,
        type: 'critical',
        title: 'Pest Alert - Zone C Peppers',
        message: 'Aphid infestation detected on pepper plants in Zone C. Visual inspection confirmed on 8 plants. Immediate organic treatment recommended.',
        time: '10 minutes ago',
        action: 'Treat Zone C',
        zone: 'Zone C',
        plant: 'Peppers'
      });
    }

    if (sensorData.lightLevel < 30) {
      alerts.push({
        id: 4,
        type: 'info',
        title: 'Low Light - Zone D Herbs',
        message: `Basil and parsley in Zone D receiving only ${sensorData.lightLevel.toFixed(0)}% optimal light. Growth rate may be reduced without supplemental lighting.`,
        time: '15 minutes ago',
        action: 'Adjust Zone D Lights',
        zone: 'Zone D',
        plant: 'Herbs'
      });
    }

    // Add zone-specific system notifications
    alerts.push({
      id: 5,
      type: 'success',
      title: 'Irrigation Completed - Zone A',
      message: 'Automated drip irrigation delivered 2.3L to 12 tomato plants in Zone A. Soil moisture increased from 35% to 78%.',
      time: '1 hour ago',
      action: 'View Details',
      zone: 'Zone A',
      plant: 'Tomatoes'
    });

    alerts.push({
      id: 6,
      type: 'info',
      title: 'Scheduled Harvest - Zone B',
      message: 'Outer lettuce leaves in Zone B ready for harvest. 6 plants showing optimal leaf size and color.',
      time: '2 hours ago',
      action: 'Schedule Harvest',
      zone: 'Zone B',
      plant: 'Lettuce'
    });

    return alerts;
  };

  const alerts = generateAlerts();

  const handleAlertAction = (alert: any) => {
    toast({
      title: `${alert.action} Initiated`,
      description: `Action for ${alert.plant} in ${alert.zone} has been started.`,
    });
  };

  const dismissAlert = (alertId: number) => {
    toast({
      title: "Alert Dismissed",
      description: "Alert has been marked as resolved.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Bell className="h-5 w-5" />
            <span>Alert Center</span>
          </CardTitle>
          <CardDescription>
            Zone-specific notifications and plant health alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.type === 'critical').length}
              </div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
            <div className="text-center p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.type === 'warning').length}
              </div>
              <div className="text-sm text-yellow-600">Warnings</div>
            </div>
            <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {alerts.filter(a => a.type === 'info').length}
              </div>
              <div className="text-sm text-blue-600">Info</div>
            </div>
            <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.type === 'success').length}
              </div>
              <div className="text-sm text-green-600">Success</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Active Alerts by Zone</CardTitle>
          <CardDescription>
            Plant-specific notifications requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <Badge variant="outline" className={getBadgeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      {alert.zone && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          {alert.zone}
                        </Badge>
                      )}
                      {alert.plant && (
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {alert.plant}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{alert.time}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleAlertAction(alert)}
                      >
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zone Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Zone Status Overview</CardTitle>
          <CardDescription>
            Current status of all greenhouse zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Zone A - Tomatoes</h4>
              <div className="text-sm text-gray-600">12 plants • Last watered: 1h ago</div>
              <Badge className="mt-1 bg-red-100 text-red-700">Needs Attention</Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Zone B - Lettuce</h4>
              <div className="text-sm text-gray-600">18 plants • Harvest ready: 6 plants</div>
              <Badge className="mt-1 bg-yellow-100 text-yellow-700">Monitor Temperature</Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Zone C - Peppers</h4>
              <div className="text-sm text-gray-600">8 plants • Pest treatment needed</div>
              <Badge className="mt-1 bg-red-100 text-red-700">Critical</Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Zone D - Herbs</h4>
              <div className="text-sm text-gray-600">15 plants • Light supplement active</div>
              <Badge className="mt-1 bg-green-100 text-green-700">Healthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPanel;
