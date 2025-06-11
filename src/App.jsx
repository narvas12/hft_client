import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/nav/NavBar';
import AdminLogin from './pages/Auth/AdminLogin';
import CreateDCABot from './pages/CreateDCABot';
import DcaBotList from './pages/DcaBotList';
import DcaBotDetail from './pages/DcaBotDetail';
import AdminRegister from './pages/Auth/AdminRegister';
import StrategyList from './pages/StrategyList';
import AccountList from './pages/AccountsList';
import CryptoTopMovers from './pages/CryptoTopMovers';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/create" element={<CreateDCABot />} />
              <Route path="/" element={<DcaBotList />} />
              <Route path="/bots/detail/:id" element={<DcaBotDetail />} />
              <Route path="/strategy/list" element={<StrategyList />} />
              <Route path="/accounts/list" element={<AccountList />} />
              <Route path="/gainers" element={<CryptoTopMovers />} />
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
