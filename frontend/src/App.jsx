import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Connect from './pages/Connect';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import LoanScore from './pages/LoanScore';
import Transactions from './pages/Transactions';
import Sidebar from './components/Sidebar';

// Layout component to wrap pages that need sidebar
const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-bgPrimary">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {children}
      </div>
    </div>
  );
};

// Protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_id');
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/connect" element={<PrivateRoute><Connect /></PrivateRoute>} />
        
        <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
        <Route path="/forecast" element={<PrivateRoute><AppLayout><Forecast /></AppLayout></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><AppLayout><Alerts /></AppLayout></PrivateRoute>} />
        <Route path="/loans" element={<PrivateRoute><AppLayout><LoanScore /></AppLayout></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><AppLayout><Transactions /></AppLayout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
