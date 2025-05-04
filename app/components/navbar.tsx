import React, { useEffect, useState } from "react";

export default function Navbar() {
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Vision", href: "#vision" },
    { name: "Contact", href: "#contact" },
  ];

  const [active, setActive] = useState<string>("home");
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = navItems.map(({ href }) => {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActive(closest.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Toggle dark mode
  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setActive(id);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-90 dark:bg-neutral-900 dark:bg-opacity-90 backdrop-blur border-b border-neutral-800 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-white dark:text-neutral-100">
        <span
          className="font-bold text-lg tracking-tight cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          J11N
        </span>
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map(({ name, href }) => {
            const id = href.slice(1);
            return (
              <li key={name}>
                <a
                  href={href}
                  onClick={e => handleClick(e, href)}
                  className={`hover:text-neutral-400 dark:hover:text-neutral-300 transition-colors duration-200 ${
                    active === id ? "text-blue-400 dark:text-blue-300" : ""
                  }`}
                >
                  {name}
                </a>
              </li>
            );
          })}
        </ul>
        <button
          onClick={toggleDark}
          className="ml-4 p-2 rounded-full bg-transparent hover:bg-neutral-800/40 dark:hover:bg-neutral-200/20 text-xl transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? "☾" : "◑"}
        </button>
      </div>
    </nav>
  );
}