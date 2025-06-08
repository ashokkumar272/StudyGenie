import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import { ChatProvider } from './context/chatContext';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Chat = lazy(() => import('./pages/Chat'));
const Admin = lazy(() => import('./pages/Admin'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <main className="flex-grow pt-16 overflow-hidden">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/chat" 
                    element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/chat/:sessionId" 
                    element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/summary/:sessionId" 
                    element={
                      <PrivateRoute>
                        <SummaryPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <PrivateRoute>
                        <Admin />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;