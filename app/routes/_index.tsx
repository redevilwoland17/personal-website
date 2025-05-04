import type { MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="pt-24 space-y-48 max-w-3xl mx-auto px-6">
      <motion.section
        id="home"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src="https://unpkg.com/lucide-static/icons/house.svg"
          alt="Home Icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 filter invert opacity-0"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Hi, I'm Jonas.</h1>
        <p className="text-neutral-400 text-lg mb-4">
          Mechanical Engineer (Imperial) turned Nanotech grad (Cambridge) exploring intelligence in machines.
          <br />
          Built K2 AI. Now focused on reinforcement learning for robotics.
        </p>
        <div className="space-x-4">
          <a href="https://github.com/7jep7" className="underline hover:text-neutral-300">GitHub</a>
          <a href="https://linkedin.com/in/jep7" className="underline hover:text-neutral-300">LinkedIn</a>
        </div>
      </motion.section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src="https://unpkg.com/lucide-static/icons/user.svg"
          alt="User"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 filter invert"
        />
        <h2 className="text-4xl md:text-5xl font-bold mb-6">About</h2>
        <p className="text-neutral-400">
          I started in mechanical engineering, took a detour into nanotech, and found myself drawn to intelligence —
          how we build it, and how machines can learn to move in the world.
          <br /><br />
          Now, I'm focused on reinforcement learning for robotics. I care about building systems that adapt, learn, and
          eventually help us solve meaningful real-world problems.
        </p>
      </motion.section>

      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src="https://unpkg.com/lucide-static/icons/code.svg"
          alt="Code Icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 filter invert"
        />
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Projects</h2>
        <ul className="text-neutral-400 space-y-2">
          <li>
            <strong>K2 AI</strong> – Co-founded a startup focused on AI infrastructure and tooling.
          </li>
          <li>
            <strong>RL Projects</strong> – A growing collection of environments, agents, and experiments: <br />
            <a href="https://github.com/7jep7/RL-Projects" className="underline hover:text-neutral-300">
              github.com/7jep7/RL-Projects
            </a>
          </li>
          <li>
            <strong>Hackathons</strong> – I occasionally build fast, fun, and sometimes useful things with friends.
          </li>
        </ul>
      </motion.section>

      <motion.section
        id="vision"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src="https://unpkg.com/lucide-static/icons/eye.svg"
          alt="Vision"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 filter invert"
        />
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Vision</h2>
        <p className="text-neutral-400">
          I'm excited about a future where machines learn the way animals do — through trial, error, and embodiment.
          <br /><br />
          I believe the next wave of progress will come from systems that can move, adapt, and reason in the physical world.
          <br /><br />
          I want to help build those systems.
        </p>
      </motion.section>
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src="https://unpkg.com/lucide-static/icons/mail.svg"
          alt="Mail Icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 filter invert"
        />
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Contact</h2>
        <p className="text-neutral-400">
          Feel free to reach out:
          <br />
          <a href="https://linkedin.com/in/jep7" className="underline hover:text-neutral-300">LinkedIn</a>
          <br />
          Or check out my work on <a href="https://github.com/7jep7" className="underline hover:text-neutral-300">GitHub</a>
        </p>
      </motion.section>
    </main>
  );
}
