export default function Navbar() {
    const navItems = [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Projects", href: "#projects" },
      { name: "Vision", href: "#vision" },
      { name: "Contact", href: "#contact" },
    ];
  
    return (
      <nav className="fixed top-0 w-full bg-black bg-opacity-90 backdrop-blur border-b border-neutral-800 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-white">
          <span className="font-bold text-lg tracking-tight">J11N</span>
          <ul className="flex space-x-6 text-sm font-medium">
            {navItems.map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className="hover:text-neutral-400 transition-colors duration-200"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }