import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import SummaryPage from './pages/SummaryPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import { ChatProvider } from './context/chatContext';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <main className="flex-grow pt-16 overflow-hidden">
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
            </main>
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;