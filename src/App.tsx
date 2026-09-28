import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Community = lazy(() => import("./pages/Community"));
const About = lazy(() => import("./pages/About"));
const CodeOfConduct = lazy(() => import("./pages/CodeOfConduct"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Hackathons = lazy(() => import("./pages/Hackathons"));
const Documentation = lazy(() => import("./pages/Documentation"));
const ProjectGuidelines = lazy(() => import("./pages/ProjectGuidelines"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DevNull = lazy(() => import("./pages/DevNull"));

function RouteFallback() {
  return (
    <div
      className="min-h-[50vh] bg-black"
      aria-busy="true"
      aria-label="Loading"
    />
  );
}

function PageContent() {
  const location = useLocation();
  const voidGame = location.pathname === "/dev/null";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans selection:bg-foss-green selection:text-black">
      {!voidGame && <Navigation />}
      <main className="grow">
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/dev/null" element={<DevNull />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!voidGame && <Footer />}
    </div>
  );
}

/** One-shot redirect for legacy HashRouter bookmarks (#/events → /events). */
function LegacyHashRedirect() {
  useEffect(() => {
    const { hash, search } = window.location;
    // Legacy app routes look like "#/events". Skip in-page anchors like "#about".
    if (!hash.startsWith("#/")) return;
    const raw = hash.slice(1); // "/events" or "/events?x=1"
    const q = raw.indexOf("?");
    const pathname = (q === -1 ? raw : raw.slice(0, q)) || "/";
    const fromHash = q === -1 ? "" : raw.slice(q);
    window.location.replace(`${pathname}${fromHash || search}`);
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <LegacyHashRedirect />
      <PageContent />
    </BrowserRouter>
  );
}

export default App;
