import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ExternalLink, Github, Play, Zap } from "lucide-react";
import { HandTeleopApiDemo } from "~/components/HandTeleopApiDemo";

export default function HandTeleopProject() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Hand Teleop System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional robotic hand teleoperation using MediaPipe and WiLoR with real-time 3D visualization
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary">MediaPipe</Badge>
            <Badge variant="secondary">WiLoR</Badge>
            <Badge variant="secondary">Three.js</Badge>
            <Badge variant="secondary">FastAPI</Badge>
            <Badge variant="secondary">Real-time</Badge>
            <Badge variant="secondary">Computer Vision</Badge>
          </div>
        </div>

        {/* Live Demo */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-semibold">Live Demo</h2>
            <Badge variant="outline" className="ml-auto">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <iframe
              src="https://hand-teleop-api.onrender.com"
              className="w-full h-[700px] border-0"
              title="Hand Teleop System - Full Application"
              allow="camera; microphone"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            <strong>Note:</strong> This is the full hand teleop system running as a microservice. 
            Grant camera permission for real-time hand tracking, 3D robot visualization, and inverse kinematics.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🏗️ Microservices Architecture</h4>
            <p className="text-blue-700 text-sm">
              This demo runs on a separate backend service deployed on Render.com, demonstrating modern microservices patterns:
            </p>
            <ul className="text-blue-600 text-sm mt-2 space-y-1">
              <li>• <strong>Frontend:</strong> This portfolio site (Remix on Vercel)</li>
              <li>• <strong>Backend:</strong> Hand tracking API (Python FastAPI on Render.com)</li>
              <li>• <strong>Live API:</strong> <a href="https://hand-teleop-api.onrender.com/docs" target="_blank" className="underline">hand-teleop-api.onrender.com</a></li>
              <li>• <strong>Integration:</strong> Cross-origin iframe with secure communication</li>
            </ul>
          </div>
        </Card>

        {/* Project Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">🎯 Project Overview</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Real-time hand pose estimation and tracking</li>
              <li>• Professional 3D robot visualization with Three.js</li>
              <li>• Dual tracking models: MediaPipe (live) and WiLoR (high-quality)</li>
              <li>• Robust camera access with comprehensive error handling</li>
              <li>• Multiple robot model support (SO-101, SO-100, Koch, MOSS)</li>
              <li>• Live inverse kinematics and joint angle computation</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">�� Tech Stack</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• HTML5/JavaScript</li>
                  <li>• MediaPipe Hands</li>
                  <li>• Three.js (3D graphics)</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Backend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Python FastAPI</li>
                  <li>• WiLoR model</li>
                  <li>• Computer Vision</li>
                  <li>• Real-time processing</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Features */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">✨ Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤚</span>
              </div>
              <h4 className="font-medium mb-2">Real-Time Tracking</h4>
              <p className="text-sm text-gray-600">
                Live hand pose estimation at 30+ FPS with MediaPipe integration
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-medium mb-2">3D Robot Viz</h4>
              <p className="text-sm text-gray-600">
                Professional 3D robot visualization with procedural and mesh-based models
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-medium mb-2">Dual Models</h4>
              <p className="text-sm text-gray-600">
                MediaPipe for live tracking, WiLoR for high-quality pose estimation
              </p>
            </div>
          </div>
        </Card>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <a 
              href="https://github.com/7jep7/hand-teleop-system" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View Source Code
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a 
              href="/projects/hand-teleop-system/README.md" 
              target="_blank"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Documentation
            </a>
          </Button>
        </div>

        {/* Live API Demo */}
        <HandTeleopApiDemo />

        {/* Technical Details */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">�� Technical Implementation</h3>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              This project demonstrates advanced computer vision and robotics integration:
            </p>
            <ul className="space-y-2 mb-4">
              <li><strong>Hand Pose Estimation:</strong> Utilizes MediaPipe Hands for real-time tracking and WiLoR for high-precision pose estimation</li>
              <li><strong>Inverse Kinematics:</strong> Real-time computation of 6-DOF robot joint angles from hand positions</li>
              <li><strong>3D Visualization:</strong> Professional robot visualization with Three.js, including procedural and mesh-based models</li>
              <li><strong>Camera Management:</strong> Robust camera access with comprehensive error handling and fallback modes</li>
              <li><strong>Multi-Robot Support:</strong> Configurable for different robot models with varying degrees of freedom</li>
            </ul>
            <p>
              The system provides a seamless interface for controlling robotic manipulators through intuitive hand gestures, 
              bridging the gap between human motion and robotic control.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
