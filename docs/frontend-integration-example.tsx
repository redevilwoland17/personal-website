// Frontend API Integration Example for jonaspetersen.com
// This shows how to integrate with the hand-teleop backend deployed on Render.com

import { useState, useEffect, useRef } from 'react';

// ===== CONFIGURATION =====

const API_CONFIG = {
  // Production URLs
  BACKEND_URL: process.env.NODE_ENV === 'production' 
    ? 'https://hand-teleop-api.onrender.com'  // Your Render.com URL
    : 'http://localhost:8000',
  
  // WebSocket URL
  WS_URL: process.env.NODE_ENV === 'production'
    ? 'wss://hand-teleop-api.onrender.com'
    : 'ws://localhost:8000'
};

// ===== TYPES =====

interface HandPosition {
  x: number;
  y: number; 
  z: number;
}

interface FingertipData {
  thumb?: HandPosition;
  index_pip?: HandPosition;
  index_tip?: HandPosition;
}

interface RobotControl {
  joint_angles: number[];
  end_effector_pose: {
    position: HandPosition;
    orientation: { roll: number; pitch: number; yaw: number };
  };
  gripper_state: 'open' | 'closed';
  in_workspace: boolean;
  confidence: number;
}

interface TrackingData {
  success: boolean;
  timestamp: string;
  hand_detected: boolean;
  fingertips: FingertipData;
  robot_control: RobotControl;
  robot_type: string;
  processing_time_ms: number;
}

// ===== MAIN COMPONENT =====

export function HandTeleopIntegration() {
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [robotType, setRobotType] = useState('SO-101');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ===== API FUNCTIONS =====

  // 1. Configuration API calls
  const updateRobotConfig = async (newRobotType: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/config/robot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robot_type: newRobotType,
          end_effector: 'gripper'
        })
      });
      
      if (response.ok) {
        setRobotType(newRobotType);
        console.log('✅ Robot config updated:', newRobotType);
      } else {
        console.error('❌ Failed to update robot config');
      }
    } catch (error) {
      console.error('❌ Robot config error:', error);
    }
  };

  const fetchAvailableRobots = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/robots`);
      const data = await response.json();
      return data.robots;
    } catch (error) {
      console.error('❌ Failed to fetch robots:', error);
      return [];
    }
  };

  // 2. WebSocket connection management
  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      wsRef.current = new WebSocket(`${API_CONFIG.WS_URL}/api/tracking/live`);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('🔗 WebSocket connected');
        
        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('❌ WebSocket message error:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setIsTracking(false);
        setConnectionStatus('disconnected');
        console.log('🔌 WebSocket disconnected');
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // 3. Message handling
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'config':
        console.log('📋 Config received:', message.data);
        break;
        
      case 'tracking_result':
        setTrackingData(message.data);
        break;
        
      case 'config_update':
        console.log('🔄 Config updated:', message.data);
        break;
        
      case 'pong':
        // Handle ping/pong for connection health
        break;
        
      default:
        console.log('📨 Unknown message type:', message.type);
    }
  };

  // 4. Tracking control
  const startTracking = () => {
    if (!isConnected) {
      connectWebSocket();
      return;
    }

    setIsTracking(true);
    setConnectionStatus('tracking');
    
    // Send start tracking command
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'start_tracking',
        data: { robot_type: robotType }
      }));
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setConnectionStatus('connected');
    
    // Send stop tracking command
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'stop_tracking'
      }));
    }
  };

  // 5. Health monitoring
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/health`);
      const health = await response.json();
      console.log('💚 Backend health:', health);
      return health.status === 'healthy';
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return false;
    }
  };

  // ===== EFFECTS =====

  useEffect(() => {
    // Check backend health on mount
    checkBackendHealth();
    
    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Keep connection alive with ping/pong
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected]);

  // ===== RENDER =====

  return (
    <div className="hand-teleop-integration">
      {/* Connection Status */}
      <div className={`status-indicator ${connectionStatus}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' || connectionStatus === 'tracking' 
              ? 'bg-green-500' 
              : connectionStatus === 'error' 
                ? 'bg-red-500' 
                : 'bg-yellow-500'
          }`} />
          <span className="text-sm font-medium">
            {connectionStatus === 'connected' && 'Connected to API'}
            {connectionStatus === 'tracking' && 'Hand Tracking Active'}
            {connectionStatus === 'disconnected' && 'Disconnected'}
            {connectionStatus === 'error' && 'Connection Error'}
          </span>
        </div>
      </div>

      {/* Robot Configuration */}
      <div className="robot-config mb-4">
        <label className="block text-sm font-medium mb-2">Robot Type:</label>
        <select 
          value={robotType} 
          onChange={(e) => updateRobotConfig(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="SO-101">SO-101 Humanoid Arm</option>
          <option value="SO-100">SO-100 Industrial Arm</option>
          <option value="KOCH">Koch Robotic Arm</option>
        </select>
      </div>

      {/* Control Buttons */}
      <div className="controls mb-4 space-x-2">
        {!isConnected ? (
          <button 
            onClick={connectWebSocket}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            🔗 Connect to API
          </button>
        ) : !isTracking ? (
          <button 
            onClick={startTracking}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🎥 Start Tracking
          </button>
        ) : (
          <button 
            onClick={stopTracking}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            ⏹️ Stop Tracking
          </button>
        )}
        
        <button 
          onClick={disconnectWebSocket}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          🔌 Disconnect
        </button>
      </div>

      {/* Live Data Display */}
      {trackingData && (
        <div className="live-data bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">🤖 Live Robot Data</h3>
          
          {/* Hand Position */}
          <div className="mb-3">
            <h4 className="font-medium text-sm">Hand Detection:</h4>
            <p className="text-sm text-gray-600">
              {trackingData.hand_detected ? '✅ Hand detected' : '❌ No hand detected'}
              {trackingData.hand_detected && trackingData.fingertips.index_tip && (
                ` • Index tip: (${trackingData.fingertips.index_tip.x.toFixed(2)}, ${trackingData.fingertips.index_tip.y.toFixed(2)}, ${trackingData.fingertips.index_tip.z.toFixed(2)})`
              )}
            </p>
          </div>

          {/* Robot Joints */}
          <div className="mb-3">
            <h4 className="font-medium text-sm">Joint Angles:</h4>
            <p className="text-sm text-gray-600 font-mono">
              {trackingData.robot_control.joint_angles.map((angle, i) => 
                `J${i+1}:${angle.toFixed(1)}°`
              ).join(', ')}
            </p>
          </div>

          {/* End Effector */}
          <div className="mb-3">
            <h4 className="font-medium text-sm">End Effector:</h4>
            <p className="text-sm text-gray-600">
              Position: ({trackingData.robot_control.end_effector_pose.position.x.toFixed(2)}, {trackingData.robot_control.end_effector_pose.position.y.toFixed(2)}, {trackingData.robot_control.end_effector_pose.position.z.toFixed(2)})
              • Gripper: {trackingData.robot_control.gripper_state}
              • Confidence: {(trackingData.robot_control.confidence * 100).toFixed(1)}%
            </p>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-medium text-sm">Performance:</h4>
            <p className="text-sm text-gray-600">
              Processing: {trackingData.processing_time_ms.toFixed(1)}ms
              • Robot: {trackingData.robot_type}
              • {trackingData.robot_control.in_workspace ? '✅ In workspace' : '⚠️ Outside workspace'}
            </p>
          </div>
        </div>
      )}

      {/* Iframe Fallback */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">🖼️ Full Demo Interface:</h3>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={`${API_CONFIG.BACKEND_URL}/demo`}
            className="w-full h-96 border-0"
            title="Hand Teleop Demo"
            allow="camera; microphone"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
