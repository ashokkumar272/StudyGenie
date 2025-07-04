import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: "Contextual Side-Threading System",
      description: "Never lose track of your learning journey. Our intelligent side-threading system automatically organizes related conversations, keeping your studies structured and accessible.",
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      demo: {
        title: "Interactive Threading Demo",
        content: "Watch as related topics automatically group together, creating a natural flow of learning that builds upon previous concepts."
      }
    },
    {
      id: 1,
      title: "Intelligent Summary Generation",
      description: "AI-powered summaries extract key insights from your learning sessions, creating comprehensive study materials that adapt to your learning style.",
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      demo: {
        title: "Smart Summary Preview",
        content: "See how complex discussions are distilled into clear, actionable study notes with highlighted key concepts and connections."
      }
    },
    {
      id: 2,
      title: "Professional PDF Export",
      description: "Transform your learning sessions into polished, professional documents. Perfect for sharing with study groups or creating personal reference materials.",
      icon: (
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      demo: {
        title: "Export Preview",
        content: "Generate beautifully formatted PDF documents with proper typography, syntax highlighting, and structured layouts."
      }
    },
    {
      id: 3,
      title: "Responsive Cross-Device Experience",
      description: "Seamlessly switch between desktop, tablet, and mobile devices. Your learning continues wherever you are with full synchronization.",
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      demo: {
        title: "Cross-Device Sync",
        content: "Start learning on your desktop, continue on your tablet, and review on your phone - all seamlessly synchronized."
      }
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enhanced Learning
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how StudyGenie's advanced features transform the way you learn, 
            making complex subjects accessible and organized.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' 
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                }`}
                onClick={() => setActiveFeature(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    activeFeature === index 
                      ? 'bg-white shadow-md' 
                      : 'bg-white'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Demo */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {features[activeFeature].demo.title}
              </h3>
              <p className="text-gray-600">
                {features[activeFeature].demo.content}
              </p>
            </div>

            {/* Demo Visualization */}
            <div className="bg-white rounded-xl p-6 shadow-inner">
              {activeFeature === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">Main Topic: React Fundamentals</p>
                    </div>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <div className="flex-1 bg-blue-25 rounded-lg p-2">
                        <p className="text-xs text-blue-700">Components & Props</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <div className="flex-1 bg-blue-25 rounded-lg p-2">
                        <p className="text-xs text-blue-700">State Management</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Key Concepts</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• React components are reusable building blocks</li>
                      <li>• Props allow data flow between components</li>
                      <li>• State manages component data changes</li>
                    </ul>
                  </div>
                  <div className="bg-purple-25 rounded-lg p-3">
                    <p className="text-xs text-purple-600">✨ AI-generated summary from your conversation</p>
                  </div>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold text-indigo-800">Study_Guide.pdf</span>
                    </div>
                    <div className="text-sm text-indigo-700">
                      <p>• Professional formatting</p>
                      <p>• Syntax highlighting</p>
                      <p>• Organized sections</p>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-green-700">Desktop</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-green-700">Tablet</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-green-700">Mobile</p>
                    </div>
                  </div>
                  <div className="bg-green-25 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600">🔄 Seamless synchronization</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;