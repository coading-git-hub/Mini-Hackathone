import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy, where, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }
      
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("createdBy", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
          const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTasks(tasksData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  // Add a new task
  const addTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        status: "todo"
      };
      
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks(prevTasks => [{id: docRef.id, ...newTask}, ...prevTasks]);
      return docRef.id;
    } catch (error) {
      console.error("Error adding task: ", error);
      throw error;
    }
  };

  // Update a task
  const updateTask = async (taskId, updatedData) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating task: ", error);
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
      throw error;
    }
  };

  // Move a task to a new status
  const moveTask = async (taskId, newStatus) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task
        )
      );
    } catch (error) {
      console.error("Error moving task: ", error);
      throw error;
    }
  };
  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};