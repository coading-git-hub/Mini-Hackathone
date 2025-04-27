
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ id, title, tasks = [], onEditTask = () => {} }) => {
  return (
    <div className="board-column">
      <h3>{title}</h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
          >
            {tasks.length === 0 ? (
              <div className="empty-column">No tasks</div>
            ) : (
              tasks.map((task, index) => (
                <Task 
                  key={task.id} 
                  task={task} 
                  index={index} 
                  onEdit={onEditTask} 
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
