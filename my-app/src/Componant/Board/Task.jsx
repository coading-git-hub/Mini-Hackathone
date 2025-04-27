import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTasks } from "../../Componant/contexts/TaskContext";

const Task = ({ task, index, onEdit }) => {
  const { deleteTask } = useTasks();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        console.log("Deleting task:", task.id);
        await deleteTask(task.id);
        console.log("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "todo":
        return "📝";
      case "inprogress":
        return "⚡";
      case "done":
        return "✅";
      default:
        return "📌";
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`draggable-task ${snapshot.isDragging ? "dragging" : ""}`}
          onClick={() => onEdit(task)}
        >
          <div className="task-card-simple">
            <div className="task-header">
              <h4>{getStatusEmoji(task.status)} {task.title}</h4>
              <button 
                onClick={handleDelete} 
                className="btn-delete-small"
                title="Delete Task"
              >
                🗑️
              </button>
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            {task.assignedTo && (
              <p className="assigned-user">👤 {task.assignedTo}</p>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;