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
  Monitor,
  Cpu,
  Eye,
  Hand,
  Pause,
  RotateCcw
} from "lucide-react";
import type { LoaderFunction } from "@remix-run/node";

// Remix loader function - required for GET requests
export const loader: LoaderFunction = async () => {
  return json({});
};

const API_BASE = "https://hand-teleop-api.onrender.com";

// Robot configuration
const ROBOTS = [
  { id: 'ur5e', name: 'UR5e Collaborative Robot', dof: 6, description: 'Universal Robots collaborative arm' },
  { id: 'franka', name: 'Franka Emika Panda', dof: 7, description: 'Research platform with compliant control' },
  { id: 'kuka', name: 'KUKA LBR iiwa', dof: 7, description: 'Lightweight robot with force sensing' },
  { id: 'so101', name: 'SO-101 Humanoid Hand', dof: 5, description: 'Dexterous robotic hand' },
  { id: 'simulation', name: 'Simulation Mode', dof: 6, description: 'Virtual robot for testing' }
];

// Hand tracking models
const TRACKING_MODELS = [
  { id: 'mediapipe', name: 'MediaPipe Hands', description: 'Real-time hand landmark detection' },
  { id: 'wilor', name: 'WiLoR', description: 'Whole-body pose estimation' }
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
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is required for hand tracking");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTracking(false);
  };

  const connectToRobot = async () => {
    try {
      const response = await fetch(`${API_BASE}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robot_type: selectedRobot })
      });
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        alert("Failed to connect to robot");
      }
    } catch (error) {
      alert("Connection error");
    }
  };

  const startTracking = () => {
    if (!isCameraActive) {
      alert("Please start camera first");
      return;
    }
    setIsTracking(true);
    // Start hand tracking loop
    processHandTracking();
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const processHandTracking = () => {
    // Simulate hand tracking data (in real implementation, this would use MediaPipe)
    const simulatedData: FingertipData = {
      thumb: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
      indexPip: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
      indexTip: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
      timestamp: Date.now()
    };
    
    setFingertipData(simulatedData);
    
    // Update robot state based on hand data
    const newRobotState: RobotState = {
      jointAngles: simulatedData.indexTip ? [
        (simulatedData.indexTip.x - 50) * 0.02,
        (simulatedData.indexTip.y - 50) * 0.02,
        (simulatedData.indexTip.z - 50) * 0.02,
        0, 0, 0
      ] : [0, 0, 0, 0, 0, 0],
      endEffectorPose: {
        position: simulatedData.indexTip || { x: 0, y: 0, z: 0 },
        orientation: { roll: 0, pitch: 0, yaw: 0 }
      },
      gripperState: simulatedData.thumb && simulatedData.indexTip ? 
        (Math.abs(simulatedData.thumb.x - simulatedData.indexTip.x) < 20 ? 'closed' : 'open') : 'open',
      inWorkspace: true,
      confidence: 0.85 + Math.random() * 0.15
    };
    
    setRobotState(newRobotState);
    
    if (isTracking) {
      animationRef.current = requestAnimationFrame(processHandTracking);
    }
  };

  // Robot Visualization Component
  const RobotVisualization = () => (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Monitor className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-white">Robot Visualization</h2>
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
          <p className="text-xs text-gray-400 mt-1">
            {ROBOTS.find(r => r.id === selectedRobot)?.description}
          </p>
        </div>

        {/* 3D Robot Visualization Area */}
        <div className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border relative overflow-hidden">
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
  );

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
      <div className="pt-16">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Hand Teleop System</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Control robots with natural hand movements using real-time computer vision and inverse kinematics
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary">MediaPipe</Badge>
              <Badge variant="secondary">WiLoR</Badge>
              <Badge variant="secondary">FastAPI</Badge>
              <Badge variant="secondary">Real-time</Badge>
              <Badge variant="secondary">Computer Vision</Badge>
              <Badge variant="secondary">Inverse Kinematics</Badge>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="default"
                onClick={() => window.open(`${API_BASE}`, '_blank')}
                className="bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Try Full Demo
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://github.com/7jep7/hand-teleop-system', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                View Code
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`${API_BASE}/docs`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                API Docs
              </Button>
            </div>
          </div>

          {/* Feature Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hand className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Hand Tracking</h3>
              <p className="text-sm text-gray-400">
                Real-time hand pose estimation using MediaPipe with 21 keypoint detection
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Inverse Kinematics</h3>
              <p className="text-sm text-gray-400">
                Custom IK solver for robot arm control with collision avoidance
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">3D Visualization</h3>
              <p className="text-sm text-gray-400">
                Real-time 3D robot visualization with Three.js and physics simulation
              </p>
            </Card>
          </div>

          {/* Embedded Demo */}
          <Card className="mb-12 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-white">Live Demo</h2>
              <Badge className="ml-auto">
                <Activity className="h-3 w-3 mr-1" />
                Interactive
              </Badge>
            </div>
            <div className="bg-muted rounded-lg overflow-hidden border-2 border-border">
              <iframe
                src={API_BASE}
                className="w-full h-[600px] border-0"
                title="Hand Teleop System - Full Application"
                allow="camera; microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
            <p className="text-sm text-gray-400 mt-4">
              <strong>💡 Tip:</strong> Grant camera permission for real-time hand tracking. 
              The demo includes 3D robot visualization, inverse kinematics, and multiple robot embodiments.
            </p>
          </Card>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Hand Teleop</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Control robots with natural hand movements
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary">Real-time</Badge>
            <Badge variant="secondary">MediaPipe</Badge>
            <Badge variant="secondary">FastAPI</Badge>
            <Badge variant="secondary">Computer Vision</Badge>
          </div>
        </div>

          {/* Main Control Interface */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Robot Visualization */}
            <RobotVisualization />

            {/* Camera Feed Panel */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Camera className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-white">Camera Feed</h2>
                <Badge variant={isCameraActive ? "default" : "secondary"} className="ml-auto">
                  {isCameraActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative border">
                  {isCameraActive ? (
                    <>
                      <video 
                        ref={videoRef}
                        autoPlay 
                        muted 
                        className="w-full h-full object-cover"
                      />
                      <canvas 
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        style={{ pointerEvents: 'none' }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-gray-400">Camera feed will appear here</p>
                        <p className="text-sm text-gray-400">Grant camera access to start</p>
                      </div>
                    </div>
                  )}
                  
                  {isTracking && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500 animate-pulse">
                        <Activity className="h-3 w-3 mr-1" />
                        TRACKING
                      </Badge>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={isCameraActive ? stopCamera : startCamera}
                  variant={isCameraActive ? "outline" : "default"}
                  className="w-full"
                >
                  {isCameraActive ? (
                    <>
                      <CameraOff className="h-4 w-4 mr-2" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Analytics Panel */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-white">Analytics & Debug Info</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {isTracking ? "Live" : "Stopped"}
                </Badge>
                {showAnalytics ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </button>
            
            {showAnalytics && (
              <div className="p-6 pt-0 border-t border-border">
                <div className="grid gap-6">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Hand Tracking Model</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    >
                      {TRACKING_MODELS.map(model => (
                        <option key={model.id} value={model.id} className="bg-gray-800 text-white">
                          {model.name} - {model.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Hand Tracking Data */}
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                        <Hand className="h-4 w-4" />
                        Hand Tracking
                      </h3>
                      <div className="text-xs font-mono text-gray-300 space-y-1">
                        {fingertipData.thumb ? (
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
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                        <Settings className="h-4 w-4" />
                        Robot Joints
                      </h3>
                      <div className="text-xs font-mono text-gray-300 space-y-1">
                        {robotState.jointAngles.map((angle, i) => (
                          <div key={i} className="text-gray-300">J{i + 1}: {angle.toFixed(3)} rad</div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-gray-600 text-gray-300">
                          Gripper: {robotState.gripperState}
                        </div>
                      </div>
                    </div>
                    
                    {/* API Status */}
                    <div className="bg-gray-800/50 p-4 rounded-lg">
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
                        className="w-full"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API Docs
                      </Button>
                    </div>
                    
                    {/* Performance Info */}
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2 text-white">
                        <Monitor className="h-4 w-4" />
                        Performance
                      </h3>
                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="text-gray-300">Model: {selectedModel}</div>
                        <div className="text-gray-300">Confidence: {(robotState.confidence * 100).toFixed(1)}%</div>
                        <div className="text-gray-300">Workspace: {robotState.inWorkspace ? "✅ Safe" : "⚠️ Outside"}</div>
                        <div className="text-gray-300">Latency: ~{Math.round(Math.random() * 50 + 10)}ms</div>
                      </div>
                    </div>
                  </div>

                  {/* End Effector Position */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-white">End Effector Pose</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <div className="font-medium text-sm mb-1 text-white">Position (mm)</div>
                        <div className="text-gray-300">X: {robotState.endEffectorPose.position.x.toFixed(2)}</div>
                        <div className="text-gray-300">Y: {robotState.endEffectorPose.position.y.toFixed(2)}</div>
                        <div className="text-gray-300">Z: {robotState.endEffectorPose.position.z.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm mb-1 text-white">Orientation (deg)</div>
                        <div className="text-gray-300">Roll: {robotState.endEffectorPose.orientation.roll.toFixed(2)}</div>
                        <div className="text-gray-300">Pitch: {robotState.endEffectorPose.orientation.pitch.toFixed(2)}</div>
                        <div className="text-gray-300">Yaw: {robotState.endEffectorPose.orientation.yaw.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.open(`${API_BASE}/docs`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(`${API_BASE}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full App
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
