# 🤖 Chatbot for Learners

A full-stack educational chatbot application designed to assist learners with their questions and provide interactive learning experiences. The platform features real-time chat capabilities, user authentication, and an admin panel for management.

## ✨ Features

- **Real-time Chat**: Interactive chatbot powered by Socket.io for instant responses
- **User Authentication**: Secure login and registration system with JWT tokens
- **Admin Panel**: Administrative interface for managing users and chat sessions
- **Chat Summaries**: Ability to view and manage chat conversation summaries
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Markdown Support**: Rich text rendering for formatted responses
- **Secure Backend**: Express.js API with MongoDB integration

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

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

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy .env.example to .env and configure your variables
# Required environment variables:
# - MONGODB_URI=your_mongodb_connection_string
# - JWT_SECRET=your_jwt_secret_key
# - PORT=5000

# Start the backend server
npm run server
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/chatbot-learners

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000

# CORS (optional)
FRONTEND_URL=http://localhost:5173
```

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

## 🎯 Usage

1. **Registration**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Chat**: Start conversations with the AI chatbot
4. **Summaries**: View your chat history and summaries
5. **Admin** (if admin user): Access administrative features

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send a message
- `GET /api/chat/summary` - Get chat summaries

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get system statistics (admin only)

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting

```bash
# Frontend linting
cd frontend
npm run lint
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 📦 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Socket.io for real-time communication
- MongoDB for the database solution
- Tailwind CSS for the styling framework
- All contributors and maintainers

## 📞 Support

If you have any questions or need help with setup, please create an issue in the repository.

---

**Happy Learning! 🎓**
