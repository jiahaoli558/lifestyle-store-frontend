import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [updateCount, setUpdateCount] = useState(0); // New state

  // Effect to load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setUpdateCount(prevCount => prevCount + 1); // Increment counter
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    // Also remove token if you are using one, though current code only shows 'user'
    localStorage.removeItem('token'); 
    setUser(null);
    setUpdateCount(prevCount => prevCount + 1); // Increment counter
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCount }}> {/* Added updateCount */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

