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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
      dark 
        ? 'bg-gray-900/60 backdrop-blur-2xl border-gray-600/20 shadow-xl shadow-black/10' 
        : 'bg-gray-800/70 backdrop-blur-md border-gray-700/50'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer"
               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="text-white font-bold text-lg">JP</span>
          </div>
        </div>
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map(({ name, href }) => {
            const id = href.slice(1);
            return (
              <li key={name}>
                <a
                  href={href}
                  onClick={e => handleClick(e, href)}
                  className={`text-gray-300 hover:text-orange-500 transition-colors duration-200 ${
                    active === id ? "text-orange-500" : ""
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
          className="ml-4 p-2 rounded-full bg-transparent hover:bg-gray-700/40 text-xl transition-colors text-gray-300"
          aria-label="Toggle dark mode"
        >
          {dark ? "☾" : "◑"}
        </button>
      </div>
    </nav>
  );
}