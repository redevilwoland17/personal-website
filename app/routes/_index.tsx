import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="pt-24 space-y-40 max-w-3xl mx-auto px-6">
      <section id="home">
        <h1 className="text-4xl font-bold mb-4">Hi, I'm Jonas.</h1>
        <p className="text-neutral-400 text-lg mb-4">
          Mechanical Engineer (Imperial) turned Nanotech grad (Cambridge) exploring intelligence in machines.
          <br />
          Built K2 AI. Now focused on reinforcement learning for robotics.
        </p>
        <div className="space-x-4">
          <a href="https://github.com/7jep7" className="underline hover:text-neutral-300">GitHub</a>
          <a href="https://linkedin.com/in/jep7" className="underline hover:text-neutral-300">LinkedIn</a>
        </div>
      </section>

      <section id="about">
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="text-neutral-400">
          I started in mechanical engineering, took a detour into nanotech, and found myself drawn to intelligence —
          how we build it, and how machines can learn to move in the world.
          <br /><br />
          Now, I'm focused on reinforcement learning for robotics. I care about building systems that adapt, learn, and
          eventually help us solve meaningful real-world problems.
        </p>
      </section>

      <section id="projects">
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
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
      </section>

      <section id="vision">
        <h2 className="text-2xl font-semibold mb-2">Vision</h2>
        <p className="text-neutral-400">
          I'm excited about a future where machines learn the way animals do — through trial, error, and embodiment.
          <br /><br />
          I believe the next wave of progress will come from systems that can move, adapt, and reason in the physical world.
          <br /><br />
          I want to help build those systems.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p className="text-neutral-400">
          Feel free to reach out:
          <br />
          <a href="https://linkedin.com/in/jep7" className="underline hover:text-neutral-300">LinkedIn</a>
          <br />
          Or check out my work on <a href="https://github.com/7jep7" className="underline hover:text-neutral-300">GitHub</a>
        </p>
      </section>
    </main>
  );
}
