import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { FiMenu } from 'react-icons/fi';
import MobileSidebar from './MobileSidebar';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { currentSessionId, startNewSession } = useContext(ChatContext);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = (e) => {
    e.preventDefault();
    if (currentSessionId) {
      navigate(`/chat/${currentSessionId}`);
    } else {
      const newSessionId = startNewSession();
      if (newSessionId) {
        navigate(`/chat/${newSessionId}`);
      }
    }
  };  return (
    <>
      {/* Desktop Navbar - hidden on mobile */}
      <div className='hidden lg:flex fixed top-0 left-0 right-0 z-10 bg-indigo-600 text-white justify-between px-6 py-4 align-bottom shadow-md'>
        <Link to="/" className='text-2xl font-bold'>StudyGenie</Link>
        <div>
          <ul className='flex gap-4 items-center'>
            {isAuthenticated ? (
              <>
                <li className="text-sm">{user?.name}</li>
                <li>
                  <button 
                    onClick={logout}
                    className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-indigo-200">Login</Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm hover:bg-indigo-100"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className='lg:hidden fixed top-0 left-0 right-0 z-10 bg-indigo-600 text-white flex justify-between items-center px-4 py-3 shadow-md'>
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-indigo-700 rounded-md transition-colors"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/" className='text-xl font-bold'>StudyGenie</Link>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
    </>
  );
};

export default Navbar;