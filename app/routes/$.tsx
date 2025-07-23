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

export default function CatchAll() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
