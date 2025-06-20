
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'critical';
  optimal: string;
}

const SensorCard = ({ title, value, icon, status, optimal }: SensorCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      default:
        return 'Optimal';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-green-800">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-green-100 rounded">
              {icon}
            </div>
            <span>{title}</span>
          </div>
          <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
            {getStatusText(status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            Optimal: {optimal}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
