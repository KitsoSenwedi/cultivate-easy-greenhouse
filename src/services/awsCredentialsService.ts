
// AWS Credentials Management Service (Frontend-only approach)
// WARNING: This stores credentials in localStorage - NOT for production use

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  dynamoTableName?: string;
}

class AWSCredentialsService {
  private readonly STORAGE_KEY = 'aws_credentials';

  // Store credentials in localStorage
  storeCredentials(credentials: AWSCredentials): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
      console.log('✅ AWS credentials stored locally');
    } catch (error) {
      console.error('❌ Failed to store AWS credentials:', error);
    }
  }

  // Retrieve credentials from localStorage
  getCredentials(): AWSCredentials | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('❌ Failed to retrieve AWS credentials:', error);
    }
    return null;
  }

  // Check if credentials are configured
  hasCredentials(): boolean {
    const credentials = this.getCredentials();
    return !!(credentials?.accessKeyId && credentials?.secretAccessKey && credentials?.region);
  }

  // Clear stored credentials
  clearCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ AWS credentials cleared');
  }

  // Validate credentials format (basic validation)
  validateCredentials(credentials: Partial<AWSCredentials>): string[] {
    const errors: string[] = [];
    
    if (!credentials.accessKeyId || credentials.accessKeyId.length < 16) {
      errors.push('Access Key ID must be at least 16 characters');
    }
    
    if (!credentials.secretAccessKey || credentials.secretAccessKey.length < 32) {
      errors.push('Secret Access Key must be at least 32 characters');
    }
    
    if (!credentials.region || credentials.region.length < 9) {
      errors.push('Region must be specified (e.g., us-east-1)');
    }
    
    return errors;
  }
}

export const awsCredentialsService = new AWSCredentialsService();
