import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Download, 
  Github, 
  Linkedin, 
  Instagram, 
  ExternalLink, 
  FileText, 
  Youtube, 
  Camera,
  Star
} from "lucide-react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Jonas Petersen - AI Engineer & Robotics Researcher" },
    { name: "description", content: "Computational engineer with AI/robotics expertise. Co-founded and scaled AI startup to €500k revenue. Cambridge MPhil, Imperial MEng. Building the future of human-robot interaction." },
    { name: "keywords", content: "AI, Robotics, Machine Learning, Reinforcement Learning, Engineer, Startup Founder" },
    { property: "og:title", content: "Jonas Petersen - AI Engineer & Robotics Researcher" },
    { property: "og:description", content: "Computational engineer with AI/robotics expertise. Co-founded and scaled AI startup to €500k revenue. Cambridge MPhil, Imperial MEng. Building the future of human-robot interaction." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://jonaspetersen.com" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Jonas Petersen - AI Engineer & Robotics Researcher" },
    { name: "twitter:description", content: "Computational engineer with AI/robotics expertise. Co-founded and scaled AI startup to €500k revenue. Cambridge MPhil, Imperial MEng. Building the future of human-robot interaction." },
  ];
};

interface Project {
  title: string;
  description: string;
  skills: string[];
  buttons: Array<{
    label: string;
    icon: any;
    href?: string;
    variant?: "default" | "secondary" | "outline";
  }>;
  featured?: boolean;
  size?: "large" | "small";
}

const projects: Project[] = [
  {
    title: "human2robot",
    description: "Coordination and data layer for the robotic age. Training data platform using imitation learning from human hand video recordings. Won 2 hackathons and secured YC interview.",
    skills: ["Python", "ROS", "Isaac Gym", "Hugging Face", "Computer Vision"],
    featured: true,
    size: "large",
    buttons: [
      { label: "GitHub", icon: Github, href: "https://github.com/7jep7/human2robot", variant: "default" as const },
      { label: "Website", icon: ExternalLink, href: "https://www.l5e.xyz", variant: "outline" as const }
    ]
  },
  {
    title: "K2 AI",
    description: "Co-founded AI startup, scaled to 10 employees and >€500k revenue. Developed task mining SaaS MVP using SLMs with positive feedback from 30+ CFOs.",
    skills: ["LLMs", "SaaS", "AI Automation"],
    size: "large",
    buttons: [
      { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/100340844", variant: "outline" as const }
    ]
  },
  {
    title: "RL Projects",
    description: "Reinforcement learning implementations including Monte Carlo Tree Search for wildfire suppression and autonomous control systems.",
    skills: ["PyTorch", "MCTS", "OpenAI Gym"],
    size: "small",
    buttons: [
      { label: "GitHub", icon: Github, href: "https://github.com/7jep7/RL-Projects", variant: "outline" as const }
    ]
  },
  {
    title: "Wildfire Suppression Model",
    description: "Master thesis project developing MDP wildfire model with Monte-Carlo Tree Search optimization. Published first-author paper in Combustion Science & Technology.",
    skills: ["MCTS", "Optimization", "Research"],
    size: "small",
    buttons: [
      { label: "Paper", icon: FileText, href: "https://drive.google.com/file/d/1XPphLHcbn0c3HYzP-rjMFvPR8HTJrSiZ/view?usp=drive_link", variant: "outline" as const }
    ]
  },
  {
    title: "Biomechanical Exoskeleton",
    description: "Gravity-compensating shoulder exoskeleton for Long-COVID patients. Built with Arduino Mega, PID control, and conducted user testing.",
    skills: ["Arduino", "PID Control", "Biomechanics"],
    size: "small",
    buttons: [
      { label: "Demo", icon: Youtube, variant: "outline" as const }
    ]
  },
  {
    title: "Photos from Stratosphere",
    description: "High-altitude photography project capturing stunning images from the stratosphere using weather balloons and custom camera systems. Engineering challenge combining electronics, atmospheric physics, and photography.",
    skills: ["Electronics", "Photography", "Atmospheric Physics"],
    size: "small",
    buttons: [
      { label: "Video", icon: Youtube, href: "https://www.youtube.com/watch?v=IPa6hRWRHTM", variant: "outline" as const },
      { label: "Kickstarter", icon: ExternalLink, href: "https://www.kickstarter.com/projects/gordonkoehn/caelum-photos-from-stratosphere", variant: "outline" as const }
    ]
  }
];

export default function Home() {
  const handleDownloadCV = () => {
    // Create a link to download the CV
    const link = document.createElement('a');
    link.href = '/cv.pdf';
    link.download = 'Jonas_Petersen_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              JP
            </div>
          </div>
          <Button 
            onClick={handleDownloadCV}
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CV
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Jonas Petersen
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Computational engineer with AI/robotics expertise. Co-founded and scaled AI startup to €500k revenue. 
              Cambridge MPhil, Imperial MEng. Building the future of human-robot interaction.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div>
            <Card className="bg-gray-800 border-gray-700 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm a German engineer and founder drawn to embodied AI, where robots learn to move and think like humans. 
                  My work spans developing advanced robotics systems to creating innovative AI solutions that solve real-world problems. 
                  I was educated at Imperial College and Cambridge University.
                </p>
                <p>
                  With a background in mechanical engineering and computing, I've led projects ranging from biomechanical 
                  exoskeletons to reinforcement learning training data pipelines. I co-founded and scaled a tech startup to 
                  €500k in revenues, less than 12 months out of uni. To me, solving embodied AI is the most challenging 
                  and enticing problem of our time.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Simple Projects Section */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Projects</h2>
          
          <div className="space-y-8">
            {/* human2robot - Featured */}
            <Card className="bg-gray-800 border-gray-700 p-8 relative">
              <div className="absolute -top-3 left-8">
                <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">human2robot</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Coordination and data layer for the robotic age. Training data platform using imitation learning from human hand video recordings. Won 2 hackathons and secured YC interview.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">Python</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">ROS</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">Isaac Gym</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">Hugging Face</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">Computer Vision</Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open('https://github.com/7jep7/human2robot', '_blank')}
                  className="bg-orange-500 hover:bg-orange-400 text-white"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.l5e.xyz', '_blank')}
                  className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Website
                </Button>
              </div>
            </Card>

            {/* K2 AI */}
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">K2 AI</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Co-founded AI startup, scaled to 10 employees and &gt;€500k revenue. Developed task mining SaaS MVP using SLMs with positive feedback from 30+ CFOs.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">LLMs</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">SaaS</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">AI Automation</Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.linkedin.com/company/100340844', '_blank')}
                  className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </Card>

            {/* Small Projects Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* RL Projects */}
              <Card className="bg-gray-800 border-gray-700 p-6 h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-3">RL Projects</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Reinforcement learning implementations including Monte Carlo Tree Search for wildfire suppression and autonomous control systems.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">PyTorch</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">MCTS</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">OpenAI Gym</Badge>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://github.com/7jep7/RL-Projects', '_blank')}
                    className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </Card>

              {/* Wildfire Suppression Model */}
              <Card className="bg-gray-800 border-gray-700 p-6 h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-3">Wildfire Suppression Model</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Master thesis project developing MDP wildfire model with Monte-Carlo Tree Search optimization. Published first-author paper in Combustion Science & Technology.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">MCTS</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Optimization</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Research</Badge>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://drive.google.com/file/d/1XPphLHcbn0c3HYzP-rjMFvPR8HTJrSiZ/view?usp=drive_link', '_blank')}
                    className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Paper
                  </Button>
                </div>
              </Card>

              {/* Biomechanical Exoskeleton */}
              <Card className="bg-gray-800 border-gray-700 p-6 h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-3">Biomechanical Exoskeleton</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Gravity-compensating shoulder exoskeleton for Long-COVID patients. Built with Arduino Mega, PID control, and conducted user testing.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Arduino</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">PID Control</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Biomechanics</Badge>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </Card>

              {/* Photos from Stratosphere */}
              <Card className="bg-gray-800 border-gray-700 p-6 h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-3">Photos from Stratosphere</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    High-altitude photography project capturing stunning images from the stratosphere using weather balloons and custom camera systems. Engineering challenge combining electronics, atmospheric physics, and photography.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Electronics</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Photography</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">Atmospheric Physics</Badge>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://www.youtube.com/watch?v=IPa6hRWRHTM', '_blank')}
                    className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://www.kickstarter.com/projects/gordonkoehn/caelum-photos-from-stratosphere', '_blank')}
                    className="border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Kickstarter
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="border-t border-gray-700 pt-12">
            <p className="text-gray-300 mb-6">Let's connect and build something amazing together</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a 
                href="https://linkedin.com/in/jep7" 
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
                <span className="font-medium">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/7jep7" 
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">GitHub</span>
              </a>
              <a 
                href="https://instagram.com/7jep7" 
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">Instagram</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm">© 2025 Jonas Petersen.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
