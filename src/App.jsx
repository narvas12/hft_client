import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/nav/NavBar';
import AdminLogin from './pages/Auth/AdminLogin';
import HomePage from './pages/Home';
import DcaBotList from './pages/DcaBotList';
import DcaBotDetail from './pages/DcaBotDetail';
import AdminRegister from './pages/Auth/AdminRegister';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bots/list" element={<DcaBotList />} />
              <Route path="/bots/detail/:id" element={<DcaBotDetail />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/register" element={<AdminRegister />} />

              {/* Catch-all route for non-existing paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
