# Hand Teleop System - Backend Implementation Requirements

## 📋 **Implementation Checklist for hand-teleop-system Repository**

This document contains all the specifications needed to make your `hand-teleop-system` repository compatible with the microservices architecture for integration with `jonaspetersen.com`.

---

## 🎯 **Core Requirements**

### **1. Repository Structure**
```
hand-teleop-system/
├── render_backend.py          # Main FastAPI application (REQUIRED)
├── requirements.txt           # Python dependencies (REQUIRED) 
├── render.yaml               # Render.com deployment config (REQUIRED)
├── README.md                 # Documentation
├── core/                     # Your existing core modules
│   ├── hand_pose/           # MediaPipe/WiLoR integration
│   ├── robot_control/       # Inverse kinematics
│   └── tracking/            # Computer vision processing
├── frontend/                # Static files for demo interface
└── tests/                   # Unit tests
```

### **2. Main Application File: `render_backend.py`**

**Required FastAPI application with these exact endpoints:**

```python
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn
import os
from datetime import datetime
from typing import Dict, List, Optional

app = FastAPI(
    title="Hand Teleop Microservice",
    description="Professional hand tracking API with real-time robot control",
    version="2.0.0"
)

# REQUIRED: CORS configuration for jonaspetersen.com integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jonaspetersen.com",
        "https://*.vercel.app", 
        "https://*.render.com",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# REQUIRED: Data models
class HandPosition(BaseModel):
    x: float
    y: float
    z: float

class FingertipData(BaseModel):
    thumb: Optional[HandPosition] = None
    index_pip: Optional[HandPosition] = None
    index_tip: Optional[HandPosition] = None

class RobotConfig(BaseModel):
    robot_type: str = "SO-101"
    end_effector: str = "gripper"
    workspace_bounds: Dict[str, List[float]] = {
        "x": [-0.3, 0.3],
        "y": [-0.2, 0.4], 
        "z": [0.1, 0.5]
    }

# REQUIRED: Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "hand-teleop-api",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

# REQUIRED: Robot configuration endpoints
@app.get("/api/robots")
async def get_available_robots():
    return {
        "robots": [
            {"id": "SO-101", "name": "SO-101 Humanoid Arm", "dof": 6},
            {"id": "SO-100", "name": "SO-100 Industrial Arm", "dof": 6},
            {"id": "KOCH", "name": "Koch Robotic Arm", "dof": 7},
            {"id": "MOSS", "name": "MOSS Robot System", "dof": 6}
        ]
    }

@app.post("/api/config/robot")
async def set_robot_config(config: RobotConfig):
    # Your implementation here
    return {
        "success": True,
        "robot_config": config.dict(),
        "message": f"Robot configured to {config.robot_type}"
    }

# REQUIRED: Main tracking endpoint
@app.post("/api/track")
async def process_hand_tracking(data: dict):
    """
    CORE IMPLEMENTATION REQUIRED:
    1. Extract image from data.get("image", "")
    2. Run MediaPipe hand detection
    3. Extract fingertip coordinates
    4. Compute inverse kinematics
    5. Calculate robot joint angles
    6. Return formatted response
    """
    
    # Your MediaPipe/WiLoR processing here
    # hand_landmarks = your_hand_detection_function(image)
    # joint_angles = your_inverse_kinematics(hand_landmarks)
    
    return {
        "success": True,
        "timestamp": datetime.now().isoformat(),
        "hand_detected": True,  # Your detection result
        "fingertips": {
            "thumb": {"x": 0.45, "y": 0.35, "z": 0.2},
            "index_pip": {"x": 0.52, "y": 0.28, "z": 0.15},
            "index_tip": {"x": 0.58, "y": 0.22, "z": 0.1}
        },
        "robot_control": {
            "joint_angles": [45.2, -30.5, 60.1, 15.0, -45.0, 90.0],
            "end_effector_pose": {
                "position": {"x": 0.25, "y": 0.15, "z": 0.30},
                "orientation": {"roll": 0, "pitch": 45, "yaw": -30}
            },
            "gripper_state": "open",
            "in_workspace": True,
            "confidence": 0.94
        },
        "robot_type": "SO-101",  # Current robot type
        "processing_time_ms": 16.7
    }

# REQUIRED: WebSocket endpoint for real-time updates
@app.websocket("/api/tracking/live")
async def websocket_tracking(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "track":
                result = await process_hand_tracking(data.get("data", {}))
                await websocket.send_json({
                    "type": "tracking_result", 
                    "data": result
                })
    except WebSocketDisconnect:
        pass

# REQUIRED: Demo interface
@app.get("/demo", response_class=HTMLResponse)
async def demo_interface():
    """
    Return HTML page with:
    - Camera access
    - MediaPipe hand tracking
    - Three.js 3D visualization
    - Robot control interface
    """
    # Your complete demo HTML here
    return "<!DOCTYPE html><!-- Your demo interface -->"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("render_backend:app", host="0.0.0.0", port=port)
```

---

## 📦 **Required Dependencies: `requirements.txt`**

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
websockets==12.0
pydantic==2.5.0
python-multipart==0.0.6
opencv-python-headless==4.8.1.78
mediapipe==0.10.8
numpy==1.24.3
Pillow==10.1.0
requests==2.31.0
aiofiles==23.2.1
python-dotenv==1.0.0
```

---

## 🚀 **Deployment Configuration: `render.yaml`**

```yaml
services:
  - type: web
    name: hand-teleop-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python render_backend.py"
    plan: free
    envVars:
      - key: PYTHON_VERSION
        value: "3.10.0"
      - key: PORT
        value: "8000"
    healthCheckPath: "/api/health"
```

---

## 🔧 **Core Implementation Requirements**

### **1. Hand Detection Integration**

**Your existing MediaPipe/WiLoR code must be integrated into:**

```python
def process_hand_frame(image_data: str) -> dict:
    """
    IMPLEMENT THIS FUNCTION:
    
    Input: Base64 encoded image string
    Output: Hand detection results
    
    Steps:
    1. Decode base64 image
    2. Run MediaPipe hands detection
    3. Extract key landmarks (thumb tip, index PIP, index tip)
    4. Return coordinates in normalized format (0-1)
    """
    
    # Decode image
    import base64
    import cv2
    import numpy as np
    
    # Remove data URL prefix if present
    if "," in image_data:
        image_data = image_data.split(",")[1]
    
    # Decode base64 to image
    image_bytes = base64.b64decode(image_data)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Your MediaPipe processing here
    # results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    
    return {
        "detected": True,
        "landmarks": [...],  # Your landmark extraction
        "confidence": 0.95
    }
```

### **2. Inverse Kinematics Integration**

```python
def compute_robot_control(hand_landmarks: dict, robot_type: str) -> dict:
    """
    IMPLEMENT THIS FUNCTION:
    
    Input: Hand landmarks and robot configuration
    Output: Robot joint angles and end-effector pose
    
    Use your existing inverse kinematics from core/robot_control/
    """
    
    # Your IK calculation here
    # joint_angles = your_ik_solver(hand_landmarks, robot_type)
    
    return {
        "joint_angles": [0, 0, 0, 0, 0, 0],  # Your calculated angles
        "end_effector_pose": {
            "position": {"x": 0, "y": 0, "z": 0},
            "orientation": {"roll": 0, "pitch": 0, "yaw": 0}
        },
        "gripper_state": "open",
        "in_workspace": True
    }
```

### **3. 3D Visualization Integration**

**Your Three.js visualization must be embedded in `/demo` endpoint:**

```html
<!-- In your demo HTML response -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// Your existing Three.js robot visualization code
// Must update robot pose in real-time from WebSocket data

function updateRobotVisualization(jointAngles) {
    // Your existing robot update code
}

// WebSocket connection for live updates
const ws = new WebSocket('wss://your-domain.onrender.com/api/tracking/live');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'tracking_result') {
        updateRobotVisualization(data.data.robot_control.joint_angles);
    }
};
</script>
```

---

## 📡 **API Contract Specifications**

### **Request/Response Formats**

**POST /api/track request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "session_id": "optional-session-id",
  "robot_type": "SO-101"
}
```

**POST /api/track response:**
```json
{
  "success": true,
  "timestamp": "2025-08-21T10:30:00Z",
  "hand_detected": true,
  "fingertips": {
    "thumb": {"x": 0.45, "y": 0.35, "z": 0.2},
    "index_pip": {"x": 0.52, "y": 0.28, "z": 0.15},
    "index_tip": {"x": 0.58, "y": 0.22, "z": 0.1}
  },
  "robot_control": {
    "joint_angles": [45.2, -30.5, 60.1, 15.0, -45.0, 90.0],
    "end_effector_pose": {
      "position": {"x": 0.25, "y": 0.15, "z": 0.30},
      "orientation": {"roll": 0, "pitch": 45, "yaw": -30}
    },
    "gripper_state": "open",
    "in_workspace": true,
    "confidence": 0.94
  },
  "robot_type": "SO-101",
  "processing_time_ms": 16.7
}
```

**WebSocket message format:**
```json
{
  "type": "tracking_result",
  "data": {
    // Same as POST /api/track response
  }
}
```

---

## 🔗 **Integration Points**

### **1. Frontend Communication**

**The frontend will:**
- Send POST requests to `/api/track` with webcam frames
- Connect to WebSocket `/api/tracking/live` for real-time updates
- Call `/api/config/robot` to change robot types
- Embed `/demo` interface via iframe

### **2. Expected URLs**

**Your deployed service must respond to:**
- `https://your-app.onrender.com/api/health` ✅ Required for health checks
- `https://your-app.onrender.com/api/track` ✅ Required for hand tracking
- `https://your-app.onrender.com/api/robots` ✅ Required for robot list
- `https://your-app.onrender.com/demo` ✅ Required for iframe embedding
- `wss://your-app.onrender.com/api/tracking/live` ✅ Required for real-time updates

### **3. CORS Requirements**

**Must allow requests from:**
- `https://jonaspetersen.com`
- `https://*.vercel.app`
- `http://localhost:3000` (development)

---

## ⚡ **Performance Requirements**

1. **Response Time:** `/api/track` must respond within 50ms
2. **Frame Rate:** Support 30fps for real-time tracking
3. **WebSocket:** Handle concurrent connections efficiently
4. **Memory:** Keep memory usage under 512MB (Render.com free tier)
5. **Startup:** Service must start within 60 seconds

---

## 🧪 **Testing Requirements**

```python
# test_api.py - Add these tests to verify compatibility

import pytest
import requests

def test_health_endpoint():
    response = requests.get("http://localhost:8000/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_robots_endpoint():
    response = requests.get("http://localhost:8000/api/robots")
    assert response.status_code == 200
    data = response.json()
    assert "robots" in data
    assert len(data["robots"]) > 0

def test_track_endpoint():
    payload = {
        "image": "data:image/jpeg;base64,test",
        "robot_type": "SO-101"
    }
    response = requests.post("http://localhost:8000/api/track", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    assert "fingertips" in data
    assert "robot_control" in data
```

---

## 📋 **Implementation Checklist**

- [ ] **Create `render_backend.py`** with all required endpoints
- [ ] **Update `requirements.txt`** with exact dependencies  
- [ ] **Add `render.yaml`** for deployment configuration
- [ ] **Integrate MediaPipe/WiLoR** into `/api/track` endpoint
- [ ] **Integrate inverse kinematics** into robot control calculations
- [ ] **Create `/demo` HTML interface** with Three.js visualization
- [ ] **Implement WebSocket handler** for real-time updates
- [ ] **Add CORS configuration** for jonaspetersen.com
- [ ] **Test all endpoints** locally before deployment
- [ ] **Deploy to Render.com** and verify URLs work
- [ ] **Update frontend** with production URLs

---

## 🎯 **Success Criteria**

Your implementation is complete when:

1. ✅ All API endpoints respond correctly
2. ✅ MediaPipe hand detection works in `/api/track`
3. ✅ Inverse kinematics calculates robot poses
4. ✅ `/demo` interface shows live hand tracking
5. ✅ WebSocket provides real-time updates
6. ✅ CORS allows requests from jonaspetersen.com
7. ✅ Service deploys successfully to Render.com
8. ✅ Frontend iframe integration works
9. ✅ All tests pass
10. ✅ Performance meets requirements (30fps, <50ms response)

This specification provides everything needed to make your `hand-teleop-system` repository compatible with the microservices architecture! 🚀
