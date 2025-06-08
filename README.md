# 🤖 StudyGenie - AI-Powered Learning Assistant

A comprehensive full-stack educational chatbot application designed to revolutionize the learning experience. StudyGenie provides interactive learning sessions with advanced features like contextual side chats, AI-powered summaries, and PDF generation - capabilities that traditional chatbots lack. The platform enables students to learn specific concepts effectively while maintaining context through innovative threading and summarization features.

## ✨ Core Features

### 🎯 **Intelligent Chat System**
- **Main Chat Interface**: Primary conversation space with AI-powered responses using Google's Gemini API
- **Real-time Communication**: Instant message delivery powered by Socket.io
- **Markdown Support**: Rich text rendering for formatted responses, code blocks, and mathematical expressions
- **Message Threading**: Organized conversation flow with proper context management

### 🔄 **Side Chat Panel - Revolutionary Learning Tool**
- **Text Selection Integration**: Select any text from AI responses to ask follow-up questions
- **Contextual Threading**: Side chat maintains context from the main conversation
- **Independent Conversations**: Multiple side chats can run simultaneously without losing context
- **Seamless Integration**: Floating side panel with intuitive "Ask about this" functionality
- **Cross-Reference Learning**: Connect concepts across different parts of the conversation

### 📊 **AI-Powered Summaries & PDF Generation**
- **Intelligent Summarization**: AI-generated summaries of entire chat sessions
- **Multi-Source Integration**: Summaries include both main chat and side chat content
- **PDF Export**: Professional PDF generation of chat summaries for offline study
- **Summary Management**: View, organize, and download previous summaries
- **Learning Progress Tracking**: Monitor your learning journey through summarized sessions

### 👥 **User Management & Authentication**
- **Secure Authentication**: JWT-based login system with password hashing
- **User Profiles**: Personalized user accounts with chat history
- **Session Management**: Persistent login sessions across browser closes
- **Password Security**: bcrypt encryption for user password protection

### 🛡️ **Admin Panel & Analytics**
- **User Management**: Comprehensive admin interface for user oversight
- **System Statistics**: Real-time analytics and usage metrics
- **Chat Monitoring**: Admin access to chat sessions and user activity
- **Performance Metrics**: Track system usage and user engagement
- **User Administration**: Add, edit, or remove user accounts

### 💾 **Advanced Data Management**
- **Chat History**: Persistent storage of all conversations
- **Session Restoration**: Resume conversations from where you left off
- **Cross-Device Sync**: Access your chats from any device
- **Data Export**: Export chat data and summaries for external use
- **Backup & Recovery**: Secure data storage with MongoDB integration

## 🌟 Key Highlights & Innovations

### 🚀 **What Makes StudyGenie Unique**

#### **Revolutionary Side Chat System**
- **Text Selection Magic**: Simply select any text from AI responses to dive deeper
- **Contextual Intelligence**: Side chats understand both the selected text and conversation context
- **Parallel Learning**: Run multiple side conversations simultaneously
- **Seamless Integration**: Floating UI that doesn't interrupt the main learning flow

#### **Comprehensive Learning Summaries**
- **AI-Powered Analysis**: Intelligent summarization of entire learning sessions
- **Multi-Source Integration**: Combines main chat and all side chat content
- **Professional PDF Export**: Generate study materials for offline learning
- **Progress Tracking**: Visual representation of learning journey

#### **Advanced User Experience**
- **Real-Time Responsiveness**: Instant AI responses with Socket.io integration
- **Mobile-First Design**: Fully responsive across all device types
- **Accessibility Focused**: Built with inclusive design principles
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

#### **Enterprise-Grade Features**
- **Secure Authentication**: JWT-based security with password encryption
- **Admin Analytics**: Comprehensive usage statistics and user management
- **Scalable Architecture**: Built to handle growing user bases
- **Data Persistence**: Reliable chat history and session management

### 📊 **Learning Analytics Dashboard**
- **Session Tracking**: Monitor learning sessions and time spent
- **Topic Analysis**: Identify frequently discussed subjects
- **Progress Visualization**: Visual charts of learning progression
- **Export Capabilities**: Download learning data and summaries

### 🔒 **Security & Privacy**
- **End-to-End Encryption**: Secure message transmission
- **Data Protection**: GDPR-compliant data handling
- **User Privacy**: No conversation data shared with third parties
- **Secure Storage**: Encrypted database storage for sensitive information

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Material-UI** - React component library for consistent design
- **React Router** - Client-side routing and navigation
- **Socket.io Client** - Real-time bidirectional communication
- **React Markdown** - Markdown rendering with syntax highlighting
- **Axios** - Promise-based HTTP client for API requests
- **React Context** - State management for auth and chat data

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling and validation
- **Socket.io** - Real-time communication server
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and security
- **Google Gemini API** - Advanced AI language model integration
- **Multer** - File upload handling for PDF generation
- **PDFKit** - PDF generation and manipulation

### Development & Deployment
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or cloud instance)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Chatbot for learners"
```

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Create .env file with the following required variables:
# MONGODB_URI=mongodb://localhost:27017/studygenie
# JWT_SECRET=your-jwt-secret-key
# GEMINI_API_KEY=your-google-gemini-api-key
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Start the backend server in development mode
npm run dev
# Or for production
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```powershell
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

### 4. Verification Steps

```powershell
# Check if backend is running
# Visit: http://localhost:5000/api/health

# Check if frontend is accessible
# Visit: http://localhost:5173

# Test Socket.io connection
# Open browser developer console and check for Socket.io connection logs
```

## 🎮 Feature Demonstrations

### **Getting Started with StudyGenie**

#### **1. Account Creation & Login**
1. Navigate to the registration page
2. Create account with email and password
3. Login with your credentials
4. Access your personalized dashboard

#### **2. Basic Chat Functionality**
```
Example Learning Session:

User: "Explain quantum computing basics"
AI: "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information. Unlike classical bits that exist in states of 0 or 1, quantum bits (qubits) can exist in superposition, being both 0 and 1 simultaneously..."

[User can now select any part of this response to ask follow-up questions]
```

#### **3. Side Chat Feature Demo**
```
Main Chat: Discussion about quantum computing
↓
User selects: "quantum bits (qubits)"
↓
Side Chat Opens: 
User: "How do qubits maintain superposition?"
AI: "Qubits maintain superposition through quantum coherence, which is preserved by isolating them from environmental interference..."

[This creates a threaded learning experience]
```

#### **4. Summary Generation**
```
After Learning Session:
1. Click "Generate Summary" button
2. AI analyzes entire conversation (main + side chats)
3. Creates comprehensive summary with key concepts
4. Option to export as PDF for offline study
```

### **Advanced Features Walkthrough**

#### **Text Selection Integration**
- **Highlight Text**: Select any portion of AI responses
- **Contextual Menu**: "Ask about this" button appears
- **Smart Context**: Side chat understands selected text + conversation context
- **Multiple Threads**: Open several side chats for different concepts

#### **PDF Export System**
- **Comprehensive Summaries**: Includes main chat and all side conversations
- **Professional Formatting**: Clean, readable PDF layout
- **Offline Study**: Download for studying without internet
- **Archive Management**: Access previous summaries anytime

#### **Admin Dashboard Features**
- **User Analytics**: View registered users and activity patterns
- **System Metrics**: Monitor chat volume and AI response times
- **Content Management**: Oversee chat sessions and summaries
- **Performance Tracking**: Real-time system health monitoring

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/studygenie
# For production, use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studygenie

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI Configuration
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-pro

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads

# Admin Configuration
ADMIN_EMAIL=admin@studygenie.com
ADMIN_PASSWORD=your-admin-password

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Required API Keys
- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **MongoDB Connection**: Use local MongoDB or [MongoDB Atlas](https://www.mongodb.com/atlas)

### Security Notes
- Use strong, unique JWT secrets in production
- Store sensitive environment variables securely
- Never commit `.env` files to version control
- Rotate API keys regularly

## 📁 Project Structure

```
├── backend/                 # Backend API server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # Database models
│   │   ├── message.js      # Message model
│   │   └── user.js         # User model
│   ├── routes/             # API routes
│   │   ├── admin.js        # Admin routes
│   │   ├── auth.js         # Authentication routes
│   │   └── chat.js         # Chat routes
│   └── utils/              # Utility functions
│       └── db.js           # Database connection
├── frontend/               # React frontend application
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── pages/          # Page components
│   └── public/             # Static assets
└── README.md               # This file
```

## 🎯 How to Use StudyGenie

### 🔐 **Getting Started**
1. **Create Account**: Register with your email and create a secure password
2. **Login**: Access your personalized learning dashboard
3. **Start Learning**: Begin conversations with the AI assistant

### 💬 **Main Chat Features**
1. **Ask Questions**: Type any learning-related question in the main chat
2. **Receive AI Responses**: Get detailed, contextual answers powered by Google Gemini
3. **View Formatted Content**: Enjoy markdown-rendered responses with code highlighting
4. **Navigate History**: Scroll through your conversation history

### 🔄 **Using Side Chat (Key Feature)**
1. **Select Text**: Highlight any portion of an AI response
2. **Click "Ask about this"**: A floating button appears for selected text
3. **Open Side Panel**: Click to launch a contextual side chat
4. **Ask Follow-ups**: Ask specific questions about the selected content
5. **Maintain Context**: Side chat remembers both main chat and selection context
6. **Multiple Threads**: Open multiple side chats for different topics

### 📄 **Summary & PDF Generation**
1. **Generate Summary**: Click the summary button after a learning session
2. **AI Processing**: The system analyzes your entire conversation (main + side chats)
3. **Review Summary**: View the comprehensive learning summary
4. **Export PDF**: Download a professional PDF for offline study
5. **Access History**: View all previous summaries in your dashboard

### 👑 **Admin Features** (Admin Users Only)
1. **User Management**: View all registered users and their activity
2. **System Analytics**: Monitor platform usage and performance metrics
3. **Chat Oversight**: Access system-wide chat statistics
4. **User Administration**: Manage user accounts and permissions

## 📁 Enhanced Project Structure

```
StudyGenie/
├── backend/                           # Backend API server
│   ├── index.js                      # Main server file with Socket.io setup
│   ├── package.json                  # Backend dependencies
│   ├── middleware/                   # Custom middleware
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/                       # MongoDB models
│   │   ├── message.js                # Chat message model
│   │   ├── user.js                   # User account model
│   │   └── summary.js                # Chat summary model
│   ├── routes/                       # API routes
│   │   ├── admin.js                  # Admin panel endpoints
│   │   ├── auth.js                   # Authentication routes
│   │   └── chat.js                   # Chat and messaging routes
│   ├── controllers/                  # Business logic controllers
│   │   ├── chatController.js         # Chat functionality controller
│   │   └── geminiService.js          # Google Gemini AI integration
│   └── utils/                        # Utility functions
│       └── db.js                     # MongoDB connection setup
├── frontend/                         # React frontend application
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── src/
│   │   ├── App.jsx                   # Main application component
│   │   ├── main.jsx                  # Application entry point
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ChatHistory.jsx       # Main chat interface
│   │   │   ├── SideChat.jsx          # Side chat panel component
│   │   │   ├── ChatSummary.jsx       # Summary generation interface
│   │   │   ├── ChatMessage.jsx       # Individual message component
│   │   │   ├── Admin.jsx             # Admin panel interface
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   └── Auth/                 # Authentication components
│   │   │       ├── Login.jsx         # Login form
│   │   │       └── Register.jsx      # Registration form
│   │   ├── context/                  # React context providers
│   │   │   ├── authContext.jsx       # Authentication state management
│   │   │   └── chatContext.jsx       # Chat state management
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # Page components
│   │   └── styles/                   # Custom CSS files
│   │       └── askAboutThis.css      # Side chat styling
│   └── public/                       # Static assets
├── PDF_FEATURE.md                    # Detailed PDF feature documentation
└── README.md                         # This comprehensive guide
```

## 🔐 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration with email and password
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/logout` - User logout and token invalidation

### Chat & Messaging Endpoints
- `GET /api/chat/history/:userId` - Retrieve user's complete chat history
- `POST /api/chat/message` - Send message and receive AI response
- `POST /api/chat/side-message` - Send message to side chat panel
- `GET /api/chat/sessions` - Get all chat sessions for a user
- `DELETE /api/chat/session/:sessionId` - Delete a specific chat session

### Summary & PDF Endpoints
- `POST /api/chat/generate-summary` - Generate AI summary of chat session
- `GET /api/chat/summaries/:userId` - Get all summaries for a user
- `GET /api/chat/summary/:summaryId` - Get specific summary details
- `POST /api/chat/export-pdf` - Generate and download PDF summary
- `DELETE /api/chat/summary/:summaryId` - Delete a specific summary

### Admin Panel Endpoints
- `GET /api/admin/users` - Get all registered users (admin only)
- `GET /api/admin/stats` - Get comprehensive system statistics (admin only)
- `GET /api/admin/chat-analytics` - Get chat usage analytics (admin only)
- `PUT /api/admin/user/:userId` - Update user information (admin only)
- `DELETE /api/admin/user/:userId` - Remove user account (admin only)
- `GET /api/admin/system-health` - Get system health metrics (admin only)

### Real-time Socket Events
- `connection` - User connects to chat system
- `join_room` - User joins their personal chat room
- `send_message` - Send message in main chat
- `send_side_message` - Send message in side chat
- `message_response` - Receive AI response
- `typing_indicator` - Show/hide typing indicators
- `disconnect` - User disconnects from chat system

## 🧪 Development & Testing

### Component Architecture

#### **Frontend Components Overview**
- **`ChatHistory.jsx`** - Main chat interface with message display and input
- **`SideChat.jsx`** - Contextual side panel for follow-up questions
- **`ChatMessage.jsx`** - Individual message rendering with text selection
- **`ChatSummary.jsx`** - AI summary generation and PDF export interface
- **`Admin.jsx`** - Administrative dashboard with user management
- **`Navbar.jsx`** - Navigation bar with authentication controls
- **`MarkdownRenderer.jsx`** - Rich text rendering for AI responses

#### **Context Providers**
- **`authContext.jsx`** - Global authentication state management
- **`chatContext.jsx`** - Chat state, messages, and Socket.io integration
- **`themeContext.jsx`** - UI theme and appearance settings

#### **Custom Hooks**
- **`useAuth.js`** - Authentication logic and user session management
- **`useChat.js`** - Chat functionality and real-time communication

### Development Workflow

```powershell
# Clone and setup
git clone <repository-url>
cd StudyGenie

# Backend setup
cd backend
npm install
# Configure .env file with required variables
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Code Quality & Testing

```powershell
# Frontend linting and formatting
cd frontend
npm run lint
npm run lint:fix

# Backend linting
cd backend
npm run lint

# Run tests
cd frontend
npm test

cd backend
npm test
```

### Building for Production

```powershell
# Build optimized frontend
cd frontend
npm run build

# Start backend in production mode
cd backend
npm start
```

### Development Best Practices

#### **Code Standards**
- Follow ESLint configuration for consistent code style
- Use Prettier for automatic code formatting
- Implement TypeScript gradually for better type safety
- Write comprehensive component documentation

#### **State Management**
- Use React Context for global state (auth, chat, theme)
- Implement custom hooks for reusable logic
- Keep component state local when possible
- Use proper dependency arrays in useEffect hooks

#### **Performance Optimization**
- Implement React.memo for expensive components
- Use useCallback and useMemo for optimization
- Lazy load components with React.lazy
- Optimize bundle size with code splitting

#### **Security Practices**
- Validate all user inputs on both client and server
- Implement proper CORS configuration
- Use HTTPS in production environments
- Sanitize user-generated content before rendering

## 📦 Deployment Guide

### Frontend Deployment Options
**Recommended Platforms:**
- **Vercel** (Recommended for React apps)
  ```bash
  npm run build
  vercel --prod
  ```
- **Netlify** (Easy drag-and-drop deployment)
- **GitHub Pages** (Free for public repositories)
- **AWS S3 + CloudFront** (Production-grade hosting)

### Backend Deployment Options
**Recommended Platforms:**
- **Railway** (Modern, developer-friendly)
- **Heroku** (Easy deployment with Git)
- **DigitalOcean App Platform** (Scalable and affordable)
- **AWS EC2** (Full control and customization)
- **Google Cloud Run** (Serverless container deployment)

### Environment Configuration for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-url
FRONTEND_URL=https://your-frontend-domain.com
GEMINI_API_KEY=your-production-gemini-key
```

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### **Backend Issues**
```bash
# MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify network access and firewall settings
- Check authentication credentials

# Gemini API Issues
- Verify API key is valid and active
- Check API quota and usage limits
- Ensure proper API key format
```

#### **Frontend Issues**
```bash
# Build Issues
npm run build
# If build fails, clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Socket.io Connection Issues
- Check backend server is running on correct port
- Verify CORS configuration
- Check network connectivity
```

#### **Development Environment**
```bash
# Port Conflicts
- Frontend default: 5173 (Vite)
- Backend default: 5000
- Change ports in package.json if needed

# Hot Reload Issues
- Restart development servers
- Clear browser cache
- Check for file watcher limits on Linux
```

### Performance Optimization
- **Database Indexing**: Add indexes for frequently queried fields
- **API Rate Limiting**: Implement rate limiting for API endpoints
- **Caching**: Use Redis for session storage and caching
- **CDN**: Use CDN for static assets in production
- **Compression**: Enable gzip compression for API responses

## 🔍 Monitoring & Analytics

### Built-in Analytics
- **User Engagement**: Track active users and session duration
- **Chat Analytics**: Monitor message frequency and AI response times
- **Error Logging**: Comprehensive error tracking and reporting
- **Performance Metrics**: API response times and system health

### Recommended Monitoring Tools
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior analytics
- **Uptime Robot** - Service availability monitoring
- **New Relic** - Application performance monitoring

## 🧠 AI Integration & Features

### **Google Gemini Integration**
StudyGenie leverages Google's advanced Gemini AI model to provide intelligent, contextual responses:

#### **AI Capabilities**
- **Natural Language Understanding**: Comprehends complex learning queries
- **Context Awareness**: Maintains conversation context across sessions
- **Multi-Modal Learning**: Handles text, code, and mathematical concepts
- **Educational Focus**: Optimized responses for learning and comprehension

#### **Smart Response Generation**
```javascript
// Example AI Integration
const response = await geminiService.generateResponse({
  message: userMessage,
  context: conversationHistory,
  selectedText: highlightedContent,
  learningGoals: userProfile.goals
});
```

#### **Contextual Side Chat Intelligence**
- **Text Analysis**: AI understands selected text significance
- **Context Bridging**: Connects side questions to main conversation
- **Adaptive Responses**: Tailors explanations to user's learning level
- **Concept Mapping**: Links related concepts across conversations

### **Summary Intelligence**
- **Content Analysis**: AI reviews entire conversation flow
- **Key Concept Extraction**: Identifies important learning points
- **Knowledge Synthesis**: Combines insights from main and side chats
- **Personalized Summaries**: Adapts to individual learning patterns

## 🚀 Future Roadmap

### **Planned Enhancements**
- **Voice Integration**: Speech-to-text and text-to-speech capabilities
- **Visual Learning**: Image and diagram generation for complex concepts
- **Collaborative Learning**: Multi-user chat sessions and study groups
- **Mobile App**: Native iOS and Android applications
- **Offline Mode**: Limited functionality without internet connection
- **Learning Analytics**: Advanced progress tracking and recommendations

### **Technical Improvements**
- **TypeScript Migration**: Full TypeScript implementation for better type safety
- **Microservices Architecture**: Scalable backend architecture
- **Advanced Caching**: Redis integration for improved performance
- **Real-time Collaboration**: Shared whiteboards and document editing
- **API Rate Limiting**: Enhanced security and usage management

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Install dependencies and set up development environment
4. Make your changes following our coding standards
5. Write tests for new functionality
6. Commit your changes (`git commit -m 'Add AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### **Areas for Contribution**
- **Frontend Components**: New UI components and improvements
- **Backend APIs**: Additional endpoints and functionality
- **AI Integration**: Enhanced AI features and optimizations
- **Documentation**: Improve guides and code documentation
- **Testing**: Unit tests, integration tests, and E2E tests
- **Performance**: Optimization and caching improvements

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** - Powering our AI capabilities
- **React Team** - For the amazing frontend framework
- **Socket.io** - Enabling real-time communication
- **MongoDB** - Reliable data storage solution
- **Tailwind CSS** - Beautiful and responsive styling
- **Vite** - Fast development and build tooling
- **Open Source Community** - For inspiration and continuous learning

## 📞 Support & Community

### **Getting Help**
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Join community conversations
- **Documentation**: Comprehensive guides and API references
- **Email Support**: technical-support@studygenie.com

### **Stay Connected**
- **GitHub**: Follow for updates and releases
- **Discord**: Join our developer community
- **Twitter**: @StudyGenieAI for announcements
- **Blog**: Latest features and educational content

---

**Transform Your Learning Experience with StudyGenie! 🎓✨**

*Empowering students with AI-driven contextual learning, intelligent summaries, and innovative side chat capabilities that traditional chatbots simply cannot provide.*
