import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './Components/TaskForm';
import TaskColumn from './Components/TaskColumn';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000');
      const tasks = await response.json();
      console.log("tasks", tasks);
      setTasks(tasks);
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    console.log('Deleting task with ID:', taskId);

    if (!taskId) {
      console.error('taskId is undefined!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (taskId, updatedTaskTitle) => {
    console.log('Updating task with ID:', taskId);

    if (!taskId) {
      console.error('taskId is undefined!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: updatedTaskTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, task: updatedTaskTitle } : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const onDrop = (status, position) => {
    console.log(`${activeCard} is going to be placed into ${status} at position ${position}`);

    if (activeCard == null || activeCard === undefined) return;

    const taskToMove = tasks[activeCard];

    if (taskToMove.status === 'done') return;

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
        <TaskColumn
          title='To do'
          tasks={tasks}
          status='todo'
          handleDelete={handleDelete}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          handleUpdate={handleUpdate} 
        />
        <TaskColumn
          title='Doing'
          tasks={tasks}
          status='doing'
          handleDelete={handleDelete}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          handleUpdate={handleUpdate} 
        />
        <TaskColumn
          title='Done'
          tasks={tasks}
          status='done'
          handleDelete={handleDelete}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
          handleUpdate={handleUpdate} 
        />
      </main>
      <h1>Active Card - {activeCard}</h1>
    </div>
  );
};

export default App;
