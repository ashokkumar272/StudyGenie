import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import { ChatProvider } from './context/chatContext';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
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

// Layout wrapper to conditionally show navbar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  
  return (
    <div className={`${showNavbar ? 'flex flex-col h-screen overflow-hidden' : ''}`}>
      {showNavbar && <Navbar />}
      <main className={`${showNavbar ? 'flex-grow pt-14 lg:pt-16 overflow-hidden' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
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
            </AppLayout>
          </Router>
        </ChatProvider>
      </AuthProvider>
    );
  };
  
  export default App;