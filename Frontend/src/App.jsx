import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Assign from './components/Assign';
import TeamManagement from './components/TeamManagement';
import Edit from './components/Edit';
import DashboardLayout from './components/user/DashboardLayout';
import Task from './components/user/Task';
import SubmitPage from './components/user/Submit';
import TeamDashboard from './components/user/TeamDashboard';
import LogOut from './components/user/LogOut';
import ProfilePage from './components/ProfilePage';
import './App.css'; 
import LoginPage from './components/Login';
import AdminRegisterPage from './components/AdminRegister';
import CreateMemberPage from './components/CreateMember';
// ✅ MUI Dialog for popup

const App = () => {
  const [user, setUser] = useState(null); // admin or member

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <Router>
      {/* Navbar always shown */}
      <Navbar user={user} setUser={setUser} onLogout={handleLogout} />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home setUser={setUser} />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register-admin" element={<AdminRegisterPage />} />
        <Route
          path="/create-member"
          element={
            user?.role === 'admin' ? (
              <CreateMemberPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
        <Route path="/assign" element={<Assign />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/team-management" element={<TeamManagement />} />
        </>
        )}

        {/* User-based Dashboard Routes */}
        <Route path="/user/:name/:userId/*" element={<DashboardLayout />}>
          <Route index element={<Task />} />
          <Route path="dashboard" element={<TeamDashboard />} />
          <Route path="tasks" element={<Task />} />
          <Route path="submit/:projectId" element={<SubmitPage />} />
          <Route path="tasks/submit/:projectId" element={<SubmitPage />} />
        </Route>

        {/* Profile Page */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Logout */}
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </Router>
  );
};

export default App;
