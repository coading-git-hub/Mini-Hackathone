
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Componant/contexts/AuthContext";
import { TaskProvider } from "./Componant/contexts/TaskContext";
import Home from "./Componant/pages/Home";
import Dashboard from "./Componant/pages/Dashboard";
import Profile from "./Componant/pages/Profile";
import Login from "./Componant/Auth/Login";
import Register from "./Componant/Auth/Register";
import Navbar from "./Componant/Layout/Navbar";
import Footer from "./Componant/Layout/Footer";
import ProtectedRoute from "./Componant/Auth/ProtectedRoute";
import "./main.css";

// Protected Route component
const ProtectedRouteWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRouteWrapper>
                      <Dashboard />
                    </ProtectedRouteWrapper>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRouteWrapper>
                      <Profile />
                    </ProtectedRouteWrapper>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

