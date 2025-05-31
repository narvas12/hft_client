import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
              <Route path="/detail" element={<DcaBotDetail />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/register" element={<AdminRegister />} />



              
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;