import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  CameraOff, 
  Power, 
  PowerOff, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Settings,
  Activity,
  Zap,
  Play,
  ArrowLeft,
  Github,
  Hand,
  Monitor,
  Cpu,
  Pause,
  Terminal,
} from "lucide-react";

export const loader = async () => {
  return json({});
};

const API_BASE = "https://hand-teleop-api.onrender.com";

const ROBOTS = [
  { id: 'ur5e', name: 'UR5e', dof: 6, description: 'Universal Robots collaborative arm for precise manipulation' },
  { id: 'franka', name: 'Franka Emika Panda', dof: 7, description: 'Research robot with torque sensors in every joint' },
  { id: 'kinova', name: 'Kinova Gen3', dof: 7, description: 'Lightweight carbon fiber arm for research applications' },
  { id: 'kuka', name: 'KUKA LBR iiwa', dof: 7, description: 'Sensitive lightweight robot for human-robot collaboration' }
];

const HAND_MODELS = [
  { id: 'mediapipe', name: 'MediaPipe Hands', description: 'Real-time hand landmark detection' },
  { id: 'wilor', name: 'WiLoR', description: 'Whole-body human mesh recovery' }
];

interface FingertipData {
  thumb: { x: number; y: number; z: number } | null;
  indexPip: { x: number; y: number; z: number } | null;
  indexTip: { x: number; y: number; z: number } | null;
  timestamp: number;
}

interface RobotState {
  jointAngles: number[];
  endEffectorPose: {
    position: { x: number; y: number; z: number };
    orientation: { roll: number; pitch: number; yaw: number };
  };
  gripperState: 'open' | 'closed';
  inWorkspace: boolean;
  confidence: number;
}

export default function HandTeleopProject() {
  // State management
  const [selectedRobot, setSelectedRobot] = useState('ur5e');
  const [selectedModel, setSelectedModel] = useState('mediapipe');
  const [isConnected, setIsConnected] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  
  // Data state
  const [fingertipData, setFingertipData] = useState<FingertipData>({
    thumb: null,
    indexPip: null,
    indexTip: null,
    timestamp: 0
  });
  const [robotState, setRobotState] = useState<RobotState>({
    jointAngles: [0, 0, 0, 0, 0, 0],
    endEffectorPose: {
      position: { x: 0, y: 0, z: 0 },
      orientation: { roll: 0, pitch: 0, yaw: 0 }
    },
    gripperState: 'open',
    inWorkspace: true,
    confidence: 0
  });

  // Refs for camera and canvas
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Helper function to log messages
  const addToConsole = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        addToConsole('Camera started successfully');
        
        // Set camera active immediately and start tracking after a delay
        setIsCameraActive(true);
        
        // Auto-start tracking after camera is ready
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            setIsTracking(true);
            addToConsole(`Hand tracking started with model: ${selectedModel}`);
            processHandTracking();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Camera error:', error);
      addToConsole(`Camera error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      alert('Camera access failed. Please check permissions.');
    }
  };

  const stopCamera = () => {
    // Stop tracking first
    if (isTracking) {
      stopTracking();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    addToConsole('Camera stopped');
  };

  const connectToRobot = async () => {
    try {
      addToConsole(`Connecting to robot: ${selectedRobot}`);
      const response = await fetch(`${API_BASE}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robot_type: selectedRobot })
      });
      
      if (response.ok) {
        const robotData = await response.json();
        setIsConnected(true);
        addToConsole(`Robot connected successfully: ${robotData.message || 'Connected'}`);
        
        // Update robot state with real data
        if (robotData.robot_state) {
          setRobotState(robotData.robot_state);
        }
        
        // Start polling robot status
        startRobotStatusPolling();
      } else {
        const errorData = await response.json();
        const errorMsg = `Failed to connect to robot: ${errorData.message || 'Unknown error'}`;
        addToConsole(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Connection error:', error);
      const errorMsg = "Connection error - check if backend is running";
      addToConsole(errorMsg);
      alert(errorMsg);
    }
  };

  const startRobotStatusPolling = () => {
    const pollRobotStatus = async () => {
      if (!isConnected) return;
      
      try {
        const response = await fetch(`${API_BASE}/robot_status`);
        if (response.ok) {
          const robotData = await response.json();
          setRobotState(robotData);
        }
      } catch (error) {
        console.error('Robot status polling error:', error);
      }
    };
    
    // Poll every 100ms for real-time updates
    const pollInterval = setInterval(pollRobotStatus, 100);
    
    // Cleanup on component unmount or disconnect
    return () => clearInterval(pollInterval);
  };

  const startTracking = () => {
    if (!isCameraActive) {
      addToConsole("Camera not active - please start camera first");
      return;
    }
    setIsTracking(true);
    addToConsole(`Hand tracking started with model: ${selectedModel}`);
    processHandTracking();
  };

  const stopTracking = () => {
    setIsTracking(false);
    addToConsole('Hand tracking stopped');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const processHandTracking = async () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    try {
      // Capture frame from video
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext('2d');
      if (tempContext) {
        tempContext.drawImage(video, 0, 0);
        
        // Convert to blob and send to API
        tempCanvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const formData = new FormData();
          formData.append('image', blob, 'frame.jpg');
          formData.append('model', selectedModel);
          
          try {
            const response = await fetch(`${API_BASE}/detect_hands`, {
              method: 'POST',
              body: formData
            });
            
            if (response.ok) {
              const data = await response.json();
              
              // Update fingertip data
              if (data.hands && data.hands.length > 0) {
                const hand = data.hands[0];
                const newFingertipData: FingertipData = {
                  thumb: hand.landmarks[4] || null,
                  indexPip: hand.landmarks[6] || null,
                  indexTip: hand.landmarks[8] || null,
                  timestamp: Date.now()
                };
                setFingertipData(newFingertipData);
                
                // Draw hand landmarks on canvas
                drawHandLandmarks(context, hand.landmarks, canvas.width, canvas.height);
                
                // Log detection
                addToConsole(`Hand detected: ${hand.landmarks.length} landmarks, confidence: ${(data.confidence || 0).toFixed(2)}`);
                
                // Send to robot control API
                if (isConnected) {
                  updateRobotFromHandData(newFingertipData);
                }
              } else {
                // Clear landmarks if no hands detected
                context.clearRect(0, 0, canvas.width, canvas.height);
                setFingertipData({
                  thumb: null,
                  indexPip: null,
                  indexTip: null,
                  timestamp: Date.now()
                });
              }
            }
          } catch (error) {
            console.error('Hand detection API error:', error);
            addToConsole(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            // Fall back to simulated data
            const simulatedData: FingertipData = {
              thumb: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
              indexPip: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
              indexTip: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
              timestamp: Date.now()
            };
            setFingertipData(simulatedData);
          }
        }, 'image/jpeg', 0.8);
      }
    } catch (error) {
      console.error('Frame capture error:', error);
    }
    
    if (isTracking) {
      animationRef.current = requestAnimationFrame(processHandTracking);
    }
  };

  const drawHandLandmarks = (context: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
    context.clearRect(0, 0, width, height);
    
    // Draw landmarks
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      // Draw landmark point
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = index === 4 || index === 8 ? '#ff6b35' : '#00ff00'; // Orange for thumb/index tip
      context.fill();
      
      // Draw landmark number
      context.fillStyle = '#ffffff';
      context.font = '10px Arial';
      context.fillText(index.toString(), x + 8, y - 8);
    });
    
    // Draw connections between landmarks (simplified)
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20]  // Pinky
    ];
    
    context.strokeStyle = '#00ff00';
    context.lineWidth = 2;
    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        context.beginPath();
        context.moveTo(landmarks[start].x * width, landmarks[start].y * height);
        context.lineTo(landmarks[end].x * width, landmarks[end].y * height);
        context.stroke();
      }
    });
  };

  const updateRobotFromHandData = async (handData: FingertipData) => {
    if (!handData.indexTip) return;
    
    try {
      const response = await fetch(`${API_BASE}/control_robot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robot_type: selectedRobot,
          hand_data: handData,
          model: selectedModel
        })
      });
      
      if (response.ok) {
        const robotData = await response.json();
        setRobotState(robotData);
      }
    } catch (error) {
      console.error('Robot control API error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b bg-gray-800/70 backdrop-blur-md border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <span className="text-white font-bold text-lg">JP</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 px-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Hand Teleop System
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Control robots with natural hand movements
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Robot Visualization */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Robot</h2>
              <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Robot Embodiment</label>
                <select 
                  value={selectedRobot}
                  onChange={(e) => setSelectedRobot(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  {ROBOTS.map(robot => (
                    <option key={robot.id} value={robot.id} className="bg-gray-800 text-white">
                      {robot.name} ({robot.dof} DOF)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3D Robot Visualization Area */}
              <div className="aspect-square bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {isConnected ? (
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Monitor className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-white">3D Robot Model</p>
                      <p className="text-xs text-gray-400">
                        {ROBOTS.find(r => r.id === selectedRobot)?.name}
                      </p>
                      {isTracking && (
                        <div className="mt-2">
                          <Badge className="bg-green-500 animate-pulse">
                            <Activity className="h-3 w-3 mr-1" />
                            Tracking Active
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Monitor className="h-16 w-16 mx-auto mb-2 opacity-30" />
                      <p className="text-gray-400">Connect robot to view 3D model</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={connectToRobot}
                  disabled={isConnected}
                  variant={isConnected ? "outline" : "default"}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {isConnected ? "Connected" : "Connect"}
                </Button>
                
                <Button 
                  onClick={isTracking ? stopTracking : startTracking}
                  disabled={!isConnected || !isCameraActive}
                  variant={isTracking ? "outline" : "default"}
                >
                  {isTracking ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Control
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Control
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Camera Feed Panel */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Camera Feed</h2>
              <Badge variant={isCameraActive ? "default" : "secondary"} className="ml-auto">
                {isCameraActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={startCamera}
                  disabled={isCameraActive}
                  size="sm"
                  className="flex-1"
                >
                  {isCameraActive ? (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Camera Active
                    </>
                  ) : (
                    <>
                      <CameraOff className="h-4 w-4 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopCamera}
                  disabled={!isCameraActive}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Stop
                </Button>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: isCameraActive ? 'block' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ display: isCameraActive ? 'block' : 'none' }}
                />
                {!isCameraActive && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-gray-400">Camera feed will appear here</p>
                      <p className="text-sm text-gray-400">Grant camera access to start</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics Panel */}
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Analytics & Debug Info</h2>
            </div>
            {showAnalytics ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {showAnalytics && (
            <div className="px-6 pb-6 border-t border-gray-700">
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Hand Tracking Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    {HAND_MODELS.map(model => (
                      <option key={model.id} value={model.id} className="bg-gray-800 text-white">
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fingertip Data */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                    <Hand className="h-4 w-4" />
                    Hand Tracking
                  </h3>
                  <div className="text-xs font-mono text-gray-300 space-y-1">
                    {fingertipData.thumb && fingertipData.indexTip ? (
                      <>
                        <div className="text-gray-300">Thumb: ({fingertipData.thumb.x.toFixed(1)}, {fingertipData.thumb.y.toFixed(1)}, {fingertipData.thumb.z.toFixed(1)})</div>
                        <div className="text-gray-300">Index: ({fingertipData.indexTip?.x.toFixed(1)}, {fingertipData.indexTip?.y.toFixed(1)}, {fingertipData.indexTip?.z.toFixed(1)})</div>
                        <div className="text-gray-300">Updated: {new Date(fingertipData.timestamp).toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <div className="text-gray-300">No hand detected</div>
                    )}
                  </div>
                </div>

                {/* Robot Joint Positions */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                    <Settings className="h-4 w-4" />
                    Robot Joints
                  </h3>
                  <div className="text-xs font-mono text-gray-300 space-y-1">
                    {robotState.jointAngles.map((angle, i) => (
                      <div key={i} className="text-gray-300">J{i + 1}: {angle.toFixed(3)} rad</div>
                    ))}
                  </div>
                </div>

                {/* API Status */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                    <Zap className="h-4 w-4" />
                    API Status
                  </h3>
                  <div className={`text-sm font-medium mb-2 ${
                    apiStatus === "connected" ? "text-green-400" : 
                    apiStatus === "error" ? "text-red-400" : "text-yellow-400"
                  }`}>
                    {apiStatus === "connected" ? "✅ Connected" :
                     apiStatus === "error" ? "❌ Error" : "⏳ Checking..."}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.open(`${API_BASE}/docs`, '_blank')}
                    className="text-gray-300 border-gray-600 hover:border-orange-500 hover:text-orange-500"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    API Docs
                  </Button>
                </div>
              </div>

              {/* Output Console */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2 text-white">
                    <Terminal className="h-4 w-4" />
                    Output Console
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setConsoleLogs([])}
                    className="text-gray-300 border-gray-600 hover:border-orange-500 hover:text-orange-500"
                  >
                    Clear
                  </Button>
                </div>
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 h-32 overflow-y-auto">
                  {consoleLogs.length === 0 ? (
                    <div className="text-gray-400 text-xs">Console output will appear here...</div>
                  ) : (
                    <div className="text-xs font-mono space-y-1">
                      {consoleLogs.map((log, index) => (
                        <div key={index} className="text-gray-300">{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => window.open(`${API_BASE}`, '_blank')}
              className="text-gray-300 border-gray-600 hover:border-orange-500 hover:text-orange-500"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Demo
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://github.com/7jep7/human2robot', '_blank')}
              className="text-gray-300 border-gray-600 hover:border-orange-500 hover:text-orange-500"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
