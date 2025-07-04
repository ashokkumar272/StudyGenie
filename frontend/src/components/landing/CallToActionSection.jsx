import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/register');
    }
  };

  const handleLearnMore = () => {
    // Scroll back to top to see the whole landing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: "🚀",
      title: "Get Started in Seconds",
      description: "No complex setup required"
    },
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "AI adapts to your learning style"
    },
    {
      icon: "📚",
      title: "Unlimited Sessions",
      description: "Learn as much as you want"
    },
    {
      icon: "🔒",
      title: "Privacy Protected",
      description: "Your data stays secure"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
            Ready to Transform
            <span className="block">Your Learning?</span>
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join thousands of students, educators, and professionals who are already using StudyGenie 
            to enhance their learning experience. Start your journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <motion.button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? 'Start Learning Now' : 'Get Started Free'}
            </motion.button>
            <motion.button
              onClick={handleLearnMore}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-blue-100">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 text-2xl group-hover:bg-opacity-30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-200 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-blue-100 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-blue-100 mb-6">Trusted by learners worldwide</p>
          
          {/* Placeholder for logos/avatars */}
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="flex -space-x-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-white bg-opacity-20 rounded-full border-2 border-blue-400"></div>
              ))}
            </div>
            <div className="text-blue-100 text-sm">
              <span className="font-semibold">+10,000</span> active learners
            </div>
          </div>
        </motion.div>

        {/* Final Nudge */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-10 rounded-full px-6 py-3 text-sm">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-blue-100">
              Join the future of learning - start your journey in under 30 seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;