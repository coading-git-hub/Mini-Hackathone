import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Componant/Firebase/FirebaseConfig";
import { useTasks } from "../../Componant/contexts/TaskContext";
import { useAuth } from "../../Componant/contexts/AuthContext";

const TaskForm = ({ editTask, setEditTask, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { addTask, updateTask } = useTasks();
  const { currentUser } = useAuth();

  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Populate form with task data if editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setAssignedTo(editTask.assignedTo || "");
    } else {
      setTitle("");
      setDescription("");
      setAssignedTo("");
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    try {
      console.log("Preparing to create task...");
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        status: "todo",
        createdBy: currentUser.uid,
        createdAt: new Date()
      };
      
      console.log("Task data prepared:", taskData);
      
      if (editTask) {
        await updateTask(editTask.id, taskData);
        console.log("Task updated successfully");
      } else {
        const taskId = await addTask(taskData);
        console.log("Task created successfully with ID:", taskId);
      }
      
      // Reset form and close modal
      setTitle("");
      setDescription("");
      setAssignedTo("");
      if (onClose) onClose();
      if (setEditTask) setEditTask(null);
    } catch (error) {
      console.error("Error with task: ", error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>{editTask ? "✏️ Edit Task" : "➕ Create New Task"}</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">📝 Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">📄 Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="assignedTo">👤 Assign To</label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.displayName || user.email}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              if (onClose) onClose();
              if (setEditTask) setEditTask(null);
            }}
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "⏳ Saving..." : (editTask ? "💾 Save Changes" : "✨ Create Task")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;