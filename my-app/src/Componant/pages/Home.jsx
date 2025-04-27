import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🚀 Welcome to Task Manager</h1>
        <p>✨ Organize your tasks efficiently and boost your productivity!</p>
        
        {currentUser ? (
          <div className="auth-buttons">
            <Link to="/dashboard" className="btn-primary">
              📋 Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-primary">
              🔑 Login
            </Link>
            <Link to="/signup" className="btn-secondary">
              ✨ Sign Up
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">📝</span>
          <h3>Task Management</h3>
          <p>Create, edit, and organize your tasks with ease</p>
        </div>
        
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <h3>Real-time Updates</h3>
          <p>See changes instantly across all your devices</p>
        </div>
        
        <div className="feature">
          <span className="feature-icon">👥</span>
          <h3>Team Collaboration</h3>
          <p>Work together with your team members</p>
        </div>
        
        <div className="feature">
          <span className="feature-icon">📊</span>
          <h3>Progress Tracking</h3>
          <p>Monitor your progress and stay on track</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>🎯 Ready to Get Started?</h2>
        <p>Join thousands of users who are already managing their tasks efficiently</p>
        {!currentUser && (
          <Link to="/signup" className="btn-primary">
            🚀 Start Free Trial
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;