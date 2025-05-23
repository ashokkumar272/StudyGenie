import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  return (
    <div className='fixed top-0 left-0 right-0 z-10 bg-indigo-600 text-white flex justify-between px-6 py-4 align-bottom shadow-md'>
      <Link to="/" className='text-2xl font-bold'>AI Chatbot</Link>
      <div>
        <ul className='flex gap-4 items-center'>
          {isAuthenticated ? (
            <>
              <li className="text-sm">{user?.name}</li>
              <li>
                <Link to="/chat" className="hover:text-indigo-200">Chat</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-200">Admin</Link>
              </li>
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
  );
};

export default Navbar;