import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Certifications from './components/Certifications/Certifications';
import Projects from './components/Projects/Projects';
import Playground from './components/Playground/Playground';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollCamera from './components/ScrollCamera/ScrollCamera';
import Cursor from './components/Cursor/Cursor';
import PageProgress from './components/PageProgress/PageProgress';
import useSmoothScroll from './hooks/useSmoothScroll';
import './styles/index.css';
import './App.css';

function AppContent() {
  useSmoothScroll();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Cursor />
      <PageProgress />
      <div className="global-bg-gradient" />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div className={`app-shell ${loaded ? 'app-shell--visible' : ''}`}>
        <Navbar />
        <main className="scroll-camera-viewport">
          <Hero loaded={loaded} />
          <ScrollCamera><About /></ScrollCamera>
          <ScrollCamera><Certifications /></ScrollCamera>
          <ScrollCamera><Projects /></ScrollCamera>
          <ScrollCamera><Playground /></ScrollCamera>
          <ScrollCamera><Contact /></ScrollCamera>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
