import React from 'react';
import { motion } from 'framer-motion';

const TechnologySection = () => {
  const technologies = [
    {
      name: "React",
      description: "Modern, component-based UI framework for responsive user experiences",
      icon: "⚛️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      name: "Node.js",
      description: "Scalable backend architecture for real-time communication",
      icon: "🟢",
      color: "from-green-400 to-emerald-400"
    },
    {
      name: "MongoDB",
      description: "Flexible database for storing and organizing your learning data",
      icon: "🍃",
      color: "from-green-500 to-lime-500"
    },
    {
      name: "Google Gemini AI",
      description: "Advanced artificial intelligence for intelligent conversations and summaries",
      icon: "🤖",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for beautiful, responsive designs",
      icon: "🎨",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Vite",
      description: "Lightning-fast build tool for optimal development experience",
      icon: "⚡",
      color: "from-yellow-400 to-orange-400"
    }
  ];

  const benefits = [
    {
      title: "Lightning Fast Performance",
      description: "Optimized architecture ensures rapid response times and smooth interactions",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Scalable Architecture",
      description: "Built to grow with your learning needs, from individual study to institutional use",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
        </svg>
      )
    },
    {
      title: "Enterprise Security",
      description: "Advanced security measures protect your learning data and privacy",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Cross-Platform Compatibility",
      description: "Seamless experience across all devices and operating systems",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-white">
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
            Powered by
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Technology
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            StudyGenie leverages cutting-edge technology to deliver a seamless, intelligent learning experience. 
            Our tech stack ensures reliability, performance, and scalability.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tech.color} mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div 
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Our Technology Matters
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology delivers tangible benefits that enhance your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">&lt;100ms</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">256-bit</div>
            <div className="text-sm text-gray-600">SSL Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </motion.div>

        {/* Open Source Note */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span className="text-gray-700 font-medium">Built with transparency and community in mind</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologySection;