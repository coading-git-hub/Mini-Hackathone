// src/components/Board/Board.js
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import TaskForm from "../Tasks/TaskForm";
import { useTasks } from "../../Componant/contexts/TaskContext";

const Board = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { tasks, moveTask } = useTasks();

  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "inprogress");
  const doneTasks = tasks.filter(task => task.status === "done");

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the list or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    try {
      // Determine the new status based on the destination column
      let newStatus;
      switch (destination.droppableId) {
        case "todo-column":
          newStatus = "todo";
          break;
        case "inprogress-column":
          newStatus = "inprogress";
          break;
        case "done-column":
          newStatus = "done";
          break;
        default:
          return;
      }

      // Update the task status in Firestore
      await moveTask(draggableId, newStatus);
      
      // Log the movement for debugging
      console.log(`Task ${draggableId} moved from ${source.droppableId} to ${destination.droppableId}`);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  return (
    <div className="board">
      <div className="board-header">
        <h2>📋 Task Board</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
        >
          ➕ Create Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          <Column
            id="todo-column"
            title="📝 To Do"
            tasks={todoTasks}
            onEditTask={handleEditTask}
          />
          <Column
            id="inprogress-column"
            title="⚡ In Progress"
            tasks={inProgressTasks}
            onEditTask={handleEditTask}
          />
          <Column
            id="done-column"
            title="✅ Done"
            tasks={doneTasks}
            onEditTask={handleEditTask}
          />
        </div>
      </DragDropContext>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span 
              className="close" 
              onClick={() => {
                setShowForm(false);
                setEditTask(null);
              }}
            >
              &times;
            </span>
            <TaskForm 
              editTask={editTask}
              setEditTask={setEditTask}
              onClose={() => {
                setShowForm(false);
                setEditTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;