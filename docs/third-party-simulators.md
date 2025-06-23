
# Free Third-Party Applications to Simulate IoT Sensors

## Overview
This guide lists free applications and tools you can use to simulate greenhouse sensors and send data to AWS IoT Core for testing your system.

## 1. AWS IoT Device Simulator

### AWS IoT Device Simulator (Free Tier)
- **What it does**: Simulates thousands of connected devices
- **Cost**: Free within AWS Free Tier limits
- **Setup**: Deploy via CloudFormation template
- **URL**: https://aws.amazon.com/solutions/implementations/iot-device-simulator/

### How to use:
1. Deploy the solution in your AWS account
2. Create device types for your greenhouse sensors
3. Configure realistic data patterns
4. Send data to your IoT Core topics

## 2. MQTT Client Applications

### MQTT Explorer (Free Desktop App)
- **Platform**: Windows, Mac, Linux
- **Download**: http://mqtt-explorer.com/
- **Features**: 
  - Connect to AWS IoT Core
  - Publish sensor data manually or automatically
  - Visualize MQTT topics

### Mosquitto MQTT Client (Command Line)
```bash
# Install mosquitto client
sudo apt-get install mosquitto-clients  # Linux
brew install mosquitto                   # Mac

# Publish sensor data to AWS IoT
mosquitto_pub --cafile root-CA.crt \
              --cert device.pem.crt \
              --key private.pem.key \
              -h your-iot-endpoint.iot.us-east-1.amazonaws.com \
              -p 8883 \
              -t greenhouse/sensors \
              -m '{"deviceId":"greenhouse-01","temperature":24.5,"humidity":65}'
```

## 3. Node.js Sensor Simulator

### Create your own simulator:
```javascript
// sensor-simulator.js
const AWS = require('aws-sdk');
const iot = new AWS.Iot({region: 'us-east-1'});

const iotData = new AWS.IotData({
    endpoint: 'your-endpoint.iot.us-east-1.amazonaws.com'
});

function generateSensorData() {
    return {
        deviceId: 'greenhouse-01',
        timestamp: Date.now(),
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 30,
        soilMoisture: 60 + Math.random() * 25,
        lightLevel: 70 + Math.random() * 30,
        pestDetection: Math.random() > 0.8 ? 'high' : 'low'
    };
}

function sendData() {
    const data = generateSensorData();
    
    iotData.publish({
        topic: 'greenhouse/sensors',
        payload: JSON.stringify(data)
    }, (err, result) => {
        if (err) console.error('Error:', err);
        else console.log('Data sent:', data);
    });
}

// Send data every 30 seconds
setInterval(sendData, 30000);
```

## 4. Python Sensor Simulator

### Using AWS IoT Python SDK:
```python
# Install: pip install AWSIoTPythonSDK
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import json
import time
import random

# Configure MQTT client
myMQTTClient = AWSIoTMQTTClient("greenhouse-simulator")
myMQTTClient.configureEndpoint("your-endpoint.iot.us-east-1.amazonaws.com", 8883)
myMQTTClient.configureCredentials("root-CA.crt", "private.pem.key", "certificate.pem.crt")

# Connect
myMQTTClient.connect()

def generate_sensor_data():
    return {
        "deviceId": "greenhouse-01",
        "timestamp": int(time.time() * 1000),
        "temperature": round(20 + random.random() * 15, 1),
        "humidity": round(50 + random.random() * 30, 1),
        "soilMoisture": round(60 + random.random() * 25, 1),
        "lightLevel": round(70 + random.random() * 30, 1),
        "pestDetection": "high" if random.random() > 0.8 else "low"
    }

# Send data every 30 seconds
while True:
    data = generate_sensor_data()
    myMQTTClient.publish("greenhouse/sensors", json.dumps(data), 1)
    print(f"Published: {data}")
    time.sleep(30)
```

## 5. Mobile Apps

### IoT MQTT Panel (Android/iOS)
- **Cost**: Free
- **Features**: Create custom dashboards to send/receive MQTT data
- **Use Case**: Manual testing and control simulation

### MQTT Dash (Android)
- **Cost**: Free
- **Features**: Create buttons and gauges to send data
- **Use Case**: Simulate manual sensor readings

## 6. Browser-Based Tools

### HiveMQ WebSocket Client
- **URL**: http://www.hivemq.com/demos/websocket-client/
- **Features**: Connect to MQTT brokers via WebSocket
- **Use Case**: Quick testing without installing software

### MQTTX Web Client
- **URL**: https://mqttx.app/web-client
- **Features**: Full-featured MQTT client in browser
- **Use Case**: Cross-platform testing

## 7. Arduino/Raspberry Pi Simulators

### Wokwi (Online Arduino Simulator)
- **URL**: https://wokwi.com/
- **Cost**: Free
- **Features**: 
  - Simulate Arduino with sensors
  - WiFi connectivity
  - Can connect to real AWS IoT

### Tinkercad Circuits
- **URL**: https://www.tinkercad.com/circuits
- **Cost**: Free (Autodesk account required)
- **Features**: Visual Arduino programming

## Setup Instructions for AWS IoT Core

### 1. Get your certificates from AWS IoT Core:
- Device certificate (.pem.crt)
- Private key (.pem.key) 
- Root CA certificate

### 2. Find your IoT endpoint:
```bash
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

### 3. Test connection:
```bash
# Test with mosquitto
mosquitto_pub --cafile AmazonRootCA1.pem \
              --cert device.pem.crt \
              --key private.pem.key \
              -h your-endpoint.iot.region.amazonaws.com \
              -p 8883 \
              -t greenhouse/test \
              -m "Hello from simulator"
```

## Recommended Testing Flow

1. **Start Small**: Use MQTT Explorer for manual testing
2. **Automate**: Create Python/Node.js scripts for continuous data
3. **Scale Up**: Use AWS IoT Device Simulator for load testing
4. **Mobile Testing**: Use mobile apps for field testing scenarios

## Data Patterns to Simulate

### Realistic Greenhouse Patterns:
- **Temperature**: Daily cycles (cool morning, hot midday, cool evening)
- **Humidity**: Inverse relationship with temperature
- **Soil Moisture**: Gradual decrease, sudden increase after irrigation
- **Light**: Solar patterns + artificial lighting schedules
- **Pest Detection**: Higher probability during warm, humid conditions

This setup allows you to fully test your AWS IoT pipeline without any physical hardware!
