
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database, TestTube, Trash2 } from 'lucide-react';
import { awsCredentialsService, type AWSCredentials } from '../services/awsCredentialsService';
import { awsDataService } from '../services/awsDataService';
import { useToast } from "@/hooks/use-toast";

interface AWSConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AWSConfigModal = ({ open, onOpenChange }: AWSConfigModalProps) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<Partial<AWSCredentials>>({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    dynamoTableName: 'GreenhouseSensorData'
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Load existing credentials when modal opens
  React.useEffect(() => {
    if (open) {
      const existing = awsCredentialsService.getCredentials();
      if (existing) {
        setCredentials(existing);
      }
    }
  }, [open]);

  const handleSave = () => {
    const validationErrors = awsCredentialsService.validateCredentials(credentials);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    awsCredentialsService.storeCredentials(credentials as AWSCredentials);
    setErrors([]);
    toast({
      title: "AWS Credentials Saved",
      description: "Your AWS credentials have been stored locally.",
    });
    onOpenChange(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    const success = await awsDataService.testConnection();
    setIsTesting(false);
    
    toast({
      title: success ? "Connection Successful" : "Connection Failed",
      description: success 
        ? "Successfully connected to AWS services"
        : "Failed to connect to AWS. Please check your credentials.",
      variant: success ? "default" : "destructive"
    });
  };

  const handleClear = () => {
    awsCredentialsService.clearCredentials();
    setCredentials({
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      dynamoTableName: 'GreenhouseSensorData'
    });
    toast({
      title: "Credentials Cleared",
      description: "AWS credentials have been removed from local storage.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>AWS Configuration</span>
          </DialogTitle>
          <DialogDescription>
            Configure AWS credentials to send demo sensor data to DynamoDB and QuickSight.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Development Only:</strong> Credentials stored in browser localStorage. 
              Not suitable for production use.
            </AlertDescription>
          </Alert>

          {/* Credentials Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="accessKeyId">Access Key ID</Label>
              <Input
                id="accessKeyId"
                type="text"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                value={credentials.accessKeyId}
                onChange={(e) => setCredentials({...credentials, accessKeyId: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="secretAccessKey">Secret Access Key</Label>
              <Input
                id="secretAccessKey"
                type="password"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={credentials.secretAccessKey}
                onChange={(e) => setCredentials({...credentials, secretAccessKey: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="region">AWS Region</Label>
              <Input
                id="region"
                type="text"
                placeholder="us-east-1"
                value={credentials.region}
                onChange={(e) => setCredentials({...credentials, region: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="dynamoTableName">DynamoDB Table Name</Label>
              <Input
                id="dynamoTableName"
                type="text"
                placeholder="GreenhouseSensorData"
                value={credentials.dynamoTableName}
                onChange={(e) => setCredentials({...credentials, dynamoTableName: e.target.value})}
              />
            </div>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside text-xs">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1">
              Save Credentials
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTest}
              disabled={isTesting}
            >
              <TestTube className="h-4 w-4 mr-1" />
              {isTesting ? 'Testing...' : 'Test'}
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant={awsDataService.isConfigured() ? "default" : "secondary"}>
              {awsDataService.isConfigured() ? "✅ Configured" : "⚙️ Not Configured"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AWSConfigModal;
