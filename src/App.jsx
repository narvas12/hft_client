import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/nav/NavBar';
import TakeTest from './components/tests/TakeTest';
import AdminRegister from './pages/Auth/AdminRegister';
import ProtectedRoute from '../utils/ProtectedRoutes';
import UploadPDFQuestions from './components/forms/UploadPDFQuestions';
import ListQuestions from './components/listItems/ListQuestions';
import AdminLogin from './pages/Auth/AdminLogin';
import HomePage from './pages/Home';

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/login" element={<AdminLogin />} />
                <Route path="/register" element={<AdminRegister />} />
                <Route path="/test/take" element={<TakeTest />} /> */}

{/* 
                <Route path="/questions/upload" element={
                  <ProtectedRoute>
                    <UploadPDFQuestions />
                  </ProtectedRoute>
                } />
                <Route path="/questions/list" element={
                  <ProtectedRoute>
                    <ListQuestions />
                  </ProtectedRoute>
                } /> */}
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
  );
};

export default App;