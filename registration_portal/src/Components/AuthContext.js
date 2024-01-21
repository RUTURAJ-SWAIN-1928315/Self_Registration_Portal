// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize the authentication state from sessionStorage
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const login = () => {
    // Perform your login logic here
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Perform your logout logic here
    setIsAuthenticated(false);
  };

  // Store the authentication state in sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
