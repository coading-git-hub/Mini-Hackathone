import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Board from "../Board/Board";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate(); 

  if (loading) {
    return <div className="loading">⏳ Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏠 Welcome to Task Manager</h1>
        <p>👋 Hello, {currentUser.displayName || 'User'}!</p>
        <button onClick={handleGoHome} className="btn-primary">
          🏡 Go to Home
        </button>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <h3>Total Tasks</h3>
          <p>Manage all your tasks in one place</p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚡</span>
          <h3>In Progress</h3>
          <p>Track your ongoing tasks</p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <h3>Completed</h3>
          <p>Celebrate your achievements</p>
        </div>
      </div>
      <Board />
    </div>
  );
};

export default Dashboard;
