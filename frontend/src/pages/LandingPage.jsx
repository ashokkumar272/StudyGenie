import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TechnologySection from '../components/landing/TechnologySection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CallToActionSection from '../components/landing/CallToActionSection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 landing-page">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1 }}
      />
      {/* Hero Section */}
      <div className="landing-section">
        <HeroSection />
      </div>
      
      {/* Features Section */}
      <div id="features" className="landing-section">
        <FeaturesSection />
      </div>
      
      {/* How It Works Section */}
      <div id="how-it-works" className="landing-section">
        <HowItWorksSection />
      </div>
      
      {/* Technology Section */}
      <div id="technology" className="landing-section">
        <TechnologySection />
      </div>
      
      {/* Testimonials Section */}
      <div id="testimonials" className="landing-section">
        <TestimonialsSection />
      </div>
      
      {/* Call to Action Section */}
      <div className="landing-section">
        <CallToActionSection />
      </div>
      
      {/* Footer */}
      <div className="landing-section">
        <FooterSection />
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;