
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
  const generateAlerts = () => {
    const alerts = [];
    
    if (sensorData.soilMoisture < 40) {
      alerts.push({
        id: 1,
        type: 'critical',
        title: 'Low Soil Moisture',
        message: `Soil moisture is at ${sensorData.soilMoisture.toFixed(0)}%. Immediate watering required.`,
        time: '2 minutes ago',
        action: 'Water Now'
      });
    }

    if (sensorData.temperature > 30) {
      alerts.push({
        id: 2,
        type: 'warning',
        title: 'High Temperature',
        message: `Temperature is ${sensorData.temperature.toFixed(1)}°C. Consider increasing ventilation.`,
        time: '5 minutes ago',
        action: 'Cool Down'
      });
    }

    if (sensorData.pestDetection === 'High') {
      alerts.push({
        id: 3,
        type: 'critical',
        title: 'Pest Detection Alert',
        message: 'High pest activity detected in greenhouse zone 2. Immediate attention required.',
        time: '10 minutes ago',
        action: 'Inspect & Treat'
      });
    }

    if (sensorData.lightLevel < 30) {
      alerts.push({
        id: 4,
        type: 'info',
        title: 'Low Light Levels',
        message: `Light level is ${sensorData.lightLevel.toFixed(0)}%. Supplemental lighting recommended.`,
        time: '15 minutes ago',
        action: 'Turn On Lights'
      });
    }

    // Add some system notifications
    alerts.push({
      id: 5,
      type: 'success',
      title: 'Irrigation Completed',
      message: 'Automated watering cycle completed successfully in zone 1.',
      time: '1 hour ago',
      action: 'View Report'
    });

    alerts.push({
      id: 6,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Weekly system check scheduled for tomorrow at 9:00 AM.',
      time: '2 hours ago',
      action: 'Reschedule'
    });

    return alerts;
  };

  const alerts = generateAlerts();

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
            Real-time notifications and system alerts
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
          <CardTitle className="text-green-800">Active Alerts</CardTitle>
          <CardDescription>
            Recent notifications requiring your attention
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
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{alert.time}</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Notification Settings</CardTitle>
          <CardDescription>
            Customize how you receive alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Email Notifications
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              SMS Alerts
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Push Notifications
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Alert Thresholds
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPanel;
