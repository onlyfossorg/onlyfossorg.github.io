import React, { useState, useEffect } from "react";
import { Menu, X, Star, Github } from "lucide-react";
import type { Tab } from "../utils/types";
import Button from "./Button";
import Logo from "../assets/only-foss-light.svg";
import { NavLink, useLocation } from "react-router-dom";

const GITHUB_ORG = "onlyfossorg";
const GITHUB_URL = `https://github.com/${GITHUB_ORG}`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  const activeTab =
    location.pathname === "/"
      ? "home"
      : location.pathname.startsWith("/events")
        ? "events"
        : location.pathname.slice(1).split("/")[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch(
          `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100`,
        );
        if (!res.ok) return;
        const repos = await res.json();
        const total = repos.reduce(
          (sum: number, repo: { stargazers_count: number }) =>
            sum + repo.stargazers_count,
          0,
        );
        setStarCount(total);
      } catch {
        // silent fail
      }
    }
    fetchStars();
  }, []);

  const navItems: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "events", label: "Events" },
    { id: "community", label: "Community" },
    { id: "about", label: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-white/10 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            className="flex items-center gap-2 cursor-pointer group"
            to="/"
          >
            <img
              src={Logo}
              alt="ONLY FOSS ORG Logo"
              className="h-8 md:h-10 w-auto"
            />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.id === "home" ? "/" : `/${item.id}`}
                className={`text-sm font-mono transition-colors relative group ${
                  activeTab === item.id
                    ? "text-foss-green"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-foss-green transition-all duration-300 ${
                    activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </NavLink>
            ))}
            <NavLink
              to={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-foss-green/50 rounded-full text-sm font-mono text-gray-300 hover:text-white transition-all group"
            >
              <Github className="w-4 h-4 group-hover:text-foss-green transition-colors" />
              {starCount !== null && (
                <>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs">{starCount}</span>
                </>
              )}
            </NavLink>
            <NavLink to="/community">
              <Button variant="outline" size="sm">
                Join Us
              </Button>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.id === "home" ? "/" : `/${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left text-lg font-mono py-2 border-l-2 pl-4 transition-colors ${
                  activeTab === item.id
                    ? "text-foss-green border-foss-green bg-foss-green/5"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 border border-white/10 font-mono text-gray-300 hover:text-white hover:border-foss-green/50 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              {starCount !== null && (
                <span className="flex items-center gap-1 ml-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs">{starCount}</span>
                </span>
              )}
            </NavLink>
            <NavLink to="/community" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full mt-2">
                Join Discord
              </Button>
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
