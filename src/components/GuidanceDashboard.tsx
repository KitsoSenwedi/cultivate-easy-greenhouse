
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  Clock,
  Sprout,
  Scissors
} from 'lucide-react';

interface GuidanceDashboardProps {
  sensorData: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
    pestDetection: string;
  };
}

const GuidanceDashboard = ({ sensorData }: GuidanceDashboardProps) => {
  const recommendations = [
    {
      title: "Watering Schedule",
      description: sensorData.soilMoisture < 50 
        ? "Your soil moisture is low. Consider watering your plants soon."
        : "Soil moisture is optimal. Next watering in 2-3 days.",
      priority: sensorData.soilMoisture < 50 ? "high" : "normal",
      action: "Water plants",
      icon: <Lightbulb className="h-4 w-4" />
    },
    {
      title: "Temperature Control",
      description: sensorData.temperature > 28
        ? "Temperature is high. Increase ventilation or add shade."
        : "Temperature is in optimal range for most crops.",
      priority: sensorData.temperature > 28 ? "medium" : "normal",
      action: "Adjust climate",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Pest Management",
      description: sensorData.pestDetection === 'High'
        ? "High pest activity detected. Immediate attention required."
        : "Pest levels are under control. Continue monitoring.",
      priority: sensorData.pestDetection === 'High' ? "high" : "normal",
      action: "Check plants",
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  const plantingSchedule = [
    {
      crop: "Tomatoes",
      stage: "Flowering",
      daysLeft: 45,
      nextAction: "Support stems",
      status: "on-track"
    },
    {
      crop: "Lettuce",
      stage: "Harvest Ready",
      daysLeft: 3,
      nextAction: "Harvest outer leaves",
      status: "ready"
    },
    {
      crop: "Basil",
      stage: "Growing",
      daysLeft: 21,
      nextAction: "Pinch flowers",
      status: "on-track"
    },
    {
      crop: "Peppers",
      stage: "Seedling",
      daysLeft: 65,
      nextAction: "Transplant soon",
      status: "attention"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'attention':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Lightbulb className="h-5 w-5" />
            <span>AI Recommendations</span>
          </CardTitle>
          <CardDescription>
            Personalized guidance based on your greenhouse conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {rec.icon}
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                </div>
                <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                  {rec.priority === 'high' ? 'High Priority' : 
                   rec.priority === 'medium' ? 'Medium' : 'Normal'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                {rec.action}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Planting Schedule */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Calendar className="h-5 w-5" />
            <span>Planting Schedule</span>
          </CardTitle>
          <CardDescription>
            Track your crops and upcoming farming activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plantingSchedule.map((plant, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded">
                    <Sprout className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{plant.crop}</h3>
                    <p className="text-sm text-gray-500">{plant.stage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(plant.status)}>
                    {plant.daysLeft} days
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{plant.nextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <BookOpen className="h-5 w-5" />
            <span>Learning Center</span>
          </CardTitle>
          <CardDescription>
            Educational resources for beginner farmers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Watering Basics</h3>
              <p className="text-sm text-gray-600 mb-3">
                Learn the fundamentals of proper plant watering techniques.
              </p>
              <Button size="sm" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Guide
              </Button>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Pest Identification</h3>
              <p className="text-sm text-gray-600 mb-3">
                Visual guide to common greenhouse pests and diseases.
              </p>
              <Button size="sm" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                View Gallery
              </Button>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Harvest Timing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Know when your crops are ready for harvesting.
              </p>
              <Button size="sm" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Seasonal Planning</h3>
              <p className="text-sm text-gray-600 mb-3">
                Plan your greenhouse activities throughout the year.
              </p>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Get Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidanceDashboard;
