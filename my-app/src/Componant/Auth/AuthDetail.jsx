

import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Componant/Firebase/FirebaseConfig";
import { useAuth } from "../../Componant/contexts/AuthContext";

const AuthDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="auth-details">
      {currentUser ? (
        <>
          <span>Hello, {currentUser.displayName || "User"}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="btn-login">
          Login
        </button>
      )}
    </div>
  );
};

export default AuthDetails;