# Jonas Petersen - Portfolio Website

> **Computational engineer with AI/robotics expertise. Building the data pipelines for shipping true robotic intelligence.**

A modern, responsive portfolio website built with Remix, showcasing AI/robotics projects, startup experience, and technical expertise.

## � Live Website

**[jonaspetersen.com](https://jonaspetersen.com)**

## 🎯 About

This portfolio showcases my journey as:
- **AI/Robotics Engineer** with expertise in embodied AI and data pipelines
- **Startup Co-founder** who scaled K2 AI to €500k revenue in <12 months
- **Researcher** with published papers and hackathon wins
- **Cambridge MPhil & Imperial MEng** graduate

## ✨ Features

- **Modern Design**: Clean, professional dark theme with consistent orange branding
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Performance Optimized**: Built with Remix for fast server-side rendering
- **Interactive Elements**: Smooth hover effects and transitions
- **SEO Ready**: Comprehensive meta tags and social media optimization

## 🛠️ Tech Stack

- **Framework**: [Remix](https://remix.run/) - Full-stack web framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Reusable component library
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **Deployment**: [Vercel](https://vercel.com/) - Seamless deployment platform
- **TypeScript**: Full type safety throughout the application

## 🏗️ Project Structure

```
app/
├── components/ui/          # Reusable UI components (Button, Card, Badge)
├── lib/                    # Utility functions (cn helper)
├── routes/                 # Remix routes
│   ├── _index.tsx         # Homepage with portfolio content
│   └── $.tsx              # 404 error page
├── entry.client.tsx       # Client-side entry point
├── entry.server.tsx       # Server-side entry point
├── root.tsx               # Root layout component
└── tailwind.css           # Global styles and theme
```

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/7jep7/jonaspetersen.com.git
cd jonaspetersen.com

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site locally.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production server
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint code linting
```

## 📦 Deployment

### Vercel (Recommended)

The site is optimized for Vercel deployment:

```bash
# Build and deploy
npm run build
```

Custom `vercel.json` configuration ensures proper build output and routing.

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the following directories:
# - build/server (server-side code)
# - build/client (client-side assets)
```

## 🎨 Design System

### Color Palette
- **Primary Orange**: `orange-500` (#f97316) - Main brand color
- **Light Orange**: `orange-400` (#fb923c) - Gradients and accents  
- **Dark Orange**: `orange-600` (#ea580c) - Hover states and emphasis
- **Gray Scale**: `gray-900` to `gray-300` - Background and text hierarchy

### Typography
- **Headings**: Bold, large scale with tight tracking
- **Body Text**: Clean, readable with proper line-height
- **Gradient Text**: Eye-catching hero title with orange gradient

## 📋 Featured Projects

1. **human2robot** - Training data platform for robotic intelligence (Featured)
2. **K2 AI** - AI startup scaled to €500k revenue  
3. **RL Projects** - Reinforcement learning implementations
4. **Wildfire Suppression** - Published research with MCTS optimization
5. **Biomechanical Exoskeleton** - Arduino-based medical device
6. **Stratosphere Photography** - High-altitude imaging project

## 🤝 Contributing

This is a personal portfolio, but feedback and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

© 2025 Jonas Petersen. All rights reserved.

## 📬 Contact

- **Website**: [jonaspetersen.com](https://jonaspetersen.com)
- **LinkedIn**: [linkedin.com/in/jep7](https://linkedin.com/in/jep7)
- **GitHub**: [github.com/7jep7](https://github.com/7jep7)
- **Email**: Available on website

---

*Building the future of human-robot interaction, one data pipeline at a time.* 🤖
