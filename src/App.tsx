import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Community from "./pages/Community";
import About from "./pages/About";
import CodeOfConduct from "./pages/CodeOfConduct";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Hackathons from "./pages/Hackathons";
import Documentation from "./pages/Documentation";
import ProjectGuidelines from "./pages/ProjectGuidelines";
import NotFound from "./pages/NotFound";

function PageContent() {
  const location = useLocation();

  useEffect(() => {
    // Optional: Scroll to top
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<About />} />
      <Route path="/code-of-conduct" element={<CodeOfConduct />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/project-guidelines" element={<ProjectGuidelines />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="bg-black min-h-screen text-white flex flex-col font-sans selection:bg-foss-green selection:text-black">
        <Navigation />

        <main className="grow">
          <PageContent />
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
