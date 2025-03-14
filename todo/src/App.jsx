import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './Components/TaskForm';
import TaskColumn from './Components/TaskColumn';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000');
      const tasks = await response.json();
      console.log("tasks",tasks);
      setTasks(tasks);
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    console.log('Deleting task with ID:', taskId); // Log taskId to check if it's passed correctly
  
    if (!taskId) {
      console.error('taskId is undefined!');
      return;
    }
  
    try {
      // Send delete request to the backend
      const response = await fetch(`http://localhost:5000/${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      // Update state after deletion
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  const onDrop = (status, position) => {
    console.log(`${activeCard} is going to be placed into ${status} at position ${position}`);

    if (activeCard == null || activeCard === undefined) return;

    const taskToMove = tasks[activeCard];
    const updatedTasks = tasks.filter((task, index) => index !== activeCard);

    updatedTasks.splice(position, 0, {
      ...taskToMove,
      status: status,
    });

    setTasks(updatedTasks);
  };

  return (
    <div className='app'>
      <TaskForm setTasks={setTasks} />
      <main className='app_main'>
        <TaskColumn title='To do' tasks={tasks} status='todo' handleDelete={handleDelete} setActiveCard={setActiveCard} onDrop={onDrop} />
        <TaskColumn title='Doing' tasks={tasks} status='doing' handleDelete={handleDelete} setActiveCard={setActiveCard} onDrop={onDrop} />
        <TaskColumn title='Done' tasks={tasks} status='done' handleDelete={handleDelete} setActiveCard={setActiveCard} onDrop={onDrop} />
      </main>
      <h1>Active Card - {activeCard}</h1>
    </div>
  );
};

export default App;
