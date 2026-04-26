import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on mount
    const token = localStorage.getItem('crm_token');
    if (token) {
      // In a real app, verify token with backend
      setUser({ id: 1, name: 'Alex Carter', role: 'Agent' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Dummy login
    if (email && password) {
      localStorage.setItem('crm_token', 'dummy_token');
      setUser({ id: 1, name: 'Alex Carter', role: 'Agent' });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
