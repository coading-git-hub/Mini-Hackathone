
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useTasks } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";

const TaskCard = ({ task, onEdit }) => {
  const [assignedUser, setAssignedUser] = useState(null);
  const { deleteTask, moveTask } = useTasks();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (task.assignedTo) {
        try {
          const userDoc = await getDoc(doc(db, "users", task.assignedTo));
          if (userDoc.exists()) {
            setAssignedUser(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching assigned user: ", error);
        }
      }
    };

    fetchAssignedUser();
  }, [task.assignedTo]);

  // In TaskCard.js or Task.js
const handleDelete = (e) => {
  if (e) e.stopPropagation(); // Prevent event bubbling
  
  if (window.confirm("Are you sure you want to delete this task?")) {
    console.log("Deleting task:", task.id); // Add for debugging
    deleteTask(task.id);
    console.log("Delete button clicked for task:", task.id);
  }
  console.log("Task card rendered:", task);

};

  const handleMoveTask = (newStatus) => {
    moveTask(task.id, newStatus);
  };
  console.log("Move button clicked, moving task", task.id, "to", newStatus);

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn-edit">Edit</button>
          <button onClick={handleDelete} className="btn-delete">Delete</button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-footer">
        {assignedUser && (
          <div className="assigned-to">
            <span>Assigned to: {assignedUser.name || assignedUser.email}</span>
          </div>
        )}
        
        <div className="task-controls">
          {task.status === "todo" && (
            <button 
              onClick={() => handleMoveTask("inprogress")}
              className="btn-move"
            >
              Move to In Progress
            </button>
          )}
          
          {task.status === "inprogress" && (
            <>
              <button 
                onClick={() => handleMoveTask("todo")}
                className="btn-move"
              >
                Move to To Do
              </button>
              <button 
                onClick={() => handleMoveTask("done")}
                className="btn-move"
              >
                Move to Done
              </button>
            </>
          )}
          
          {task.status === "done" && (
            <button 
              onClick={() => handleMoveTask("inprogress")}
              className="btn-move"
            >
              Move to In Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;