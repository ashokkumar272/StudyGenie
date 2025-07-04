import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const useCases = [
    {
      id: 1,
      title: "Computer Science Student",
      scenario: "Learning React and JavaScript",
      description: "Sarah used StudyGenie to master React concepts through interactive conversations. The side-threading feature helped her organize complex topics like state management, hooks, and component lifecycle, while intelligent summaries created perfect study materials for her exams.",
      avatar: "👩‍💻",
      name: "Sarah Chen",
      role: "CS Student at MIT",
      outcome: "Improved understanding by 80% and aced her final project",
      color: "from-blue-400 to-cyan-400"
    },
    {
      id: 2,
      title: "Medical Student",
      scenario: "Studying Anatomy and Physiology",
      description: "Marcus leveraged StudyGenie's AI to break down complex medical concepts into manageable conversations. The PDF export feature allowed him to create comprehensive study guides that he shared with his study group, improving everyone's performance.",
      avatar: "👨‍⚕️",
      name: "Marcus Johnson",
      role: "Medical Student at Johns Hopkins",
      outcome: "Increased retention rates and helped 15 classmates improve",
      color: "from-green-400 to-emerald-400"
    },
    {
      id: 3,
      title: "Professional Developer",
      scenario: "Learning Cloud Architecture",
      description: "Elena used StudyGenie to stay current with rapidly evolving cloud technologies. The contextual threading helped her connect AWS services with real-world applications, while summaries became her go-to reference for implementation decisions.",
      avatar: "👩‍💼",
      name: "Elena Rodriguez",
      role: "Senior Developer at Google",
      outcome: "Successfully led cloud migration project worth $2M",
      color: "from-purple-400 to-pink-400"
    },
    {
      id: 4,
      title: "High School Teacher",
      scenario: "Creating Engaging Math Lessons",
      description: "David transformed his teaching approach using StudyGenie to create interactive math lessons. The AI helped him break down complex algebra concepts into conversational formats, making mathematics more accessible to his students.",
      avatar: "👨‍🏫",
      name: "David Kim",
      role: "Mathematics Teacher",
      outcome: "Student engagement increased by 60% and test scores improved by 35%",
      color: "from-indigo-400 to-blue-400"
    }
  ];

  const testimonials = [
    {
      id: 1,
      content: "StudyGenie revolutionized how I approach learning. The side-threading feature is genius - it keeps my thoughts organized while allowing natural exploration of topics. I wish I had this during my undergraduate years!",
      author: "Dr. Amanda Foster",
      role: "Research Scientist",
      avatar: "👩‍🔬",
      rating: 5
    },
    {
      id: 2,
      content: "As an educator, I'm amazed by how StudyGenie helps students think critically. The AI doesn't just give answers - it guides discovery. My students are more engaged and asking better questions.",
      author: "Professor James Wilson",
      role: "University Professor",
      avatar: "👨‍🎓",
      rating: 5
    },
    {
      id: 3,
      content: "The PDF export feature is incredible. I can create professional documentation of my learning sessions that I actually want to review later. It's like having a personal learning assistant.",
      author: "Lisa Thompson",
      role: "Product Manager",
      avatar: "👩‍💻",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
            Real Stories,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how StudyGenie transforms learning experiences across different fields and learning styles. 
            See the impact AI-powered education can have on your journey.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${useCase.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {useCase.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm">
                    {useCase.scenario}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {useCase.description}
              </p>

              {/* Author & Outcome */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{useCase.name}</p>
                    <p className="text-sm text-gray-500">{useCase.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Success</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium">
                    📈 {useCase.outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div 
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from educators, students, and professionals who have experienced the StudyGenie difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-blue-200 text-3xl">
                  "
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-sm text-gray-600">Students Helped</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Academic Institutions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">1M+</div>
            <div className="text-sm text-gray-600">Learning Sessions</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;