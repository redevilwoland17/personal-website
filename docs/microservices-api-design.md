# Hand Teleop System - Microservices API Design

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────────┐
│   Frontend UI   │    │  Hand Tracking API  │
│  (Remix/Vercel) │    │ (FastAPI/Render.com)│
│                 │    │                     │
│ • Robot config  │◄──►│ • Camera access     │
│ • User controls │    │ • Hand detection    │
│ • Status display│    │ • Inverse kinematics│
│ • Settings UI   │    │ • 3D visualization  │
└─────────────────┘    └─────────────────────┘
```

## API Endpoints Design

### 1. Configuration Endpoints
```
GET  /api/robots              # List available robot types
POST /api/config/robot        # Set active robot type
GET  /api/config             # Get current configuration
POST /api/config/end-effector # Set end-effector type
```

### 2. Real-time Tracking Endpoints
```
GET  /api/status              # System health & tracking status
POST /api/tracking/start      # Start hand tracking
POST /api/tracking/stop       # Stop hand tracking
GET  /api/tracking/live       # WebSocket for live hand data
```

### 3. Data Stream Endpoints
```
GET  /api/hand/position       # Current hand position
GET  /api/robot/joints        # Current joint angles
GET  /api/robot/pose          # End-effector pose
POST /api/calibration        # Calibrate workspace
```

### 4. Demo Interface
```
GET  /demo                    # Full interactive interface
GET  /embed                   # Embeddable widget version
```

## Data Structures

### Hand Position Data
```json
{
  "timestamp": "2025-08-21T10:30:00Z",
  "hand_detected": true,
  "fingertips": {
    "thumb": {"x": 0.45, "y": 0.32, "z": 0.15},
    "index_pip": {"x": 0.52, "y": 0.28, "z": 0.12},
    "index_tip": {"x": 0.58, "y": 0.25, "z": 0.08}
  },
  "confidence": 0.95
}
```

### Robot Configuration
```json
{
  "robot_type": "SO-101",
  "end_effector": "gripper",
  "workspace": {
    "x_range": [-0.3, 0.3],
    "y_range": [-0.2, 0.4],
    "z_range": [0.1, 0.5]
  },
  "joint_limits": {
    "joint_1": [-180, 180],
    "joint_2": [-90, 90]
  }
}
```

### Robot State
```json
{
  "joint_angles": [45.2, -30.5, 60.1, 15.0, -45.0, 90.0],
  "end_effector_pose": {
    "position": {"x": 0.25, "y": 0.15, "z": 0.30},
    "orientation": {"roll": 0, "pitch": 45, "yaw": -30}
  },
  "gripper_state": "open",
  "in_workspace": true
}
```

## WebSocket Communication

### Real-time Hand Tracking Stream
```javascript
// Frontend connects to backend WebSocket
const ws = new WebSocket('wss://your-hand-api.render.com/api/tracking/live');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI with live hand position
  updateHandPosition(data.fingertips);
  updateRobotVisualization(data.robot_state);
};
```

## CORS Configuration

The backend must allow requests from your frontend domain:

```python
# In FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jonaspetersen.com",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## Deployment URLs

### Production URLs
- **Frontend**: `https://jonaspetersen.com/projects/hand-teleop`
- **Backend API**: `https://hand-teleop-api.render.com`
- **Demo Interface**: `https://hand-teleop-api.render.com/demo`

### API Base URL Configuration
```typescript
// In frontend environment config
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hand-teleop-api.render.com'
  : 'http://localhost:8000';
```

## Integration Patterns

### Pattern 1: Iframe Embedding (Current)
```tsx
// Simple but limited control
<iframe 
  src="https://hand-teleop-api.render.com/demo"
  allow="camera; microphone"
/>
```

### Pattern 2: API Integration (Recommended)
```tsx
// Full control with API calls
const [robotConfig, setRobotConfig] = useState();
const [handData, setHandData] = useState();

// Configure robot type from frontend
const selectRobot = async (robotType) => {
  await fetch(`${API_BASE_URL}/api/config/robot`, {
    method: 'POST',
    body: JSON.stringify({ robot_type: robotType })
  });
};

// Start tracking session
const startTracking = async () => {
  const response = await fetch(`${API_BASE_URL}/api/tracking/start`, {
    method: 'POST'
  });
  
  // Connect to WebSocket for live data
  const ws = new WebSocket(`${API_BASE_URL}/api/tracking/live`);
  ws.onmessage = (event) => {
    setHandData(JSON.parse(event.data));
  };
};
```

## Security Considerations

1. **API Keys**: Use environment variables for sensitive configs
2. **Rate Limiting**: Implement rate limiting on tracking endpoints
3. **HTTPS Only**: Ensure all communication uses HTTPS in production
4. **Camera Permissions**: Handle camera access gracefully
5. **Input Validation**: Validate all API inputs on backend

## Performance Optimization

1. **WebSocket Throttling**: Limit updates to 30fps max
2. **Data Compression**: Compress large 3D model data
3. **Caching**: Cache robot configurations and models
4. **CDN**: Serve static assets via CDN
5. **Connection Pooling**: Optimize database connections
