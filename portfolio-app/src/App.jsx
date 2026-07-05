import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Playground from './components/Playground/Playground';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollCamera from './components/ScrollCamera/ScrollCamera';
import './styles/index.css';
import './App.css';

function AppContent() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div className={`app-shell ${loaded ? 'app-shell--visible' : ''}`}>
        <Navbar />
        <main className="scroll-camera-viewport">
          <Hero />
          <ScrollCamera><About /></ScrollCamera>
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
