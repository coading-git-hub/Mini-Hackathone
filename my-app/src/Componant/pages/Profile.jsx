
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";

const Profile = () => {
  const { currentUser, loading } = useAuth();
  const { tasks } = useTasks();
  const [userData, setUserData] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && tasks.length > 0) {
      const filteredTasks = tasks.filter(
        task => task.assignedTo === currentUser.uid
      );
      setUserTasks(filteredTasks);
    }
  }, [currentUser, tasks]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      
      <div className="profile-info">
        <div className="info-group">
          <label>Name:</label>
          <p>{currentUser.displayName || "Not set"}</p>
        </div>
        
        <div className="info-group">
          <label>Email:</label>
          <p>{currentUser.email}</p>
        </div>
        
        {userData && (
          <div className="info-group">
            <label>Account Created:</label>
            <p>{userData.createdAt?.toDate().toLocaleDateString() || "Unknown"}</p>
          </div>
        )}
      </div>
      
      <div className="profile-tasks">
        <h3>My Tasks</h3>
        
        {userTasks.length === 0 ? (
          <p>You don't have any assigned tasks.</p>
        ) : (
          <div className="task-list-profile">
            {userTasks.map(task => (
              <div key={task.id} className="task-item-profile">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <span className={`status-badge ${task.status}`}>
                  {task.status === "todo" ? "To Do" : 
                   task.status === "inprogress" ? "In Progress" : "Done"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;