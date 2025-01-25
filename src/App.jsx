import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return window.location.pathname = '/login';
    }
    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={!isLoggedIn ? <Signup /> : window.location.pathname = '/'} />
          <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : window.location.pathname = '/'} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/docs" element={
            <Docs />
          } />
          <Route path="*" element={!isLoggedIn ? <Login /> : window.location.pathname = '/'} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App