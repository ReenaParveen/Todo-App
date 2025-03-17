import React, { useState, useEffect } from 'react';
import './TaskForm.css';
import Tag from './Tag';

const TaskForm = ({ setTasks, currentTask, setCurrentTask }) => {
  const [taskData, setTaskData] = useState({
    task: '',
    status: 'todo',
    tags: [],
  });

  useEffect(() => {
    // Pre-fill the form with the current task's data when editing
    if (currentTask) {
      setTaskData(currentTask);
    }
  }, [currentTask]);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000/');
      const tasks = await response.json();
      setTasks(tasks);
    };

    fetchTasks();
  }, [setTasks]);

  const checkTag = (tag) => taskData.tags.some((item) => item === tag);

  const selectTag = (tag) => {
    if (checkTag(tag)) {
      const filteredTags = taskData.tags.filter((item) => item !== tag);
      setTaskData((prev) => ({ ...prev, tags: filteredTags }));
    } else {
      setTaskData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent updates if the task is marked as "Done"
    if (taskData.status === 'done') {
      alert("Task marked as 'Done' cannot be updated.");
      return;
    }

    try {
      const response = currentTask
        ? await fetch(`http://localhost:5000/${currentTask._id}`, {
            method: 'PUT', // If editing an existing task
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
          })
        : await fetch('http://localhost:5000', {
            method: 'POST', // If adding a new task
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
          });

      const newTask = await response.json();
      setTasks((prevTasks) =>
        currentTask
          ? prevTasks.map((task) =>
              task._id === newTask._id ? newTask : task
            )
          : [...prevTasks, newTask]
      );

      setTaskData({ task: '', status: 'todo', tags: [] });
      setCurrentTask(null); // Reset the current task after editing
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      e.target.blur(); // Remove focus from the input field
    }
  };

  return (
    <header className='app_header'>
      <form onSubmit={handleSubmit}>
        <input
          name='task'
          type='text'
          value={taskData.task}
          className='task_input'
          placeholder='Enter your Task'
          onChange={handleChange}
          onKeyPress={handleKeyPress} // Handle 'Enter' key press
          disabled={taskData.status === 'done'} // Disable input if the task is marked as 'Done'
        />
        <div className='task_form_bottom_line'>
          <div>
            <Tag tagName='HTML' selectTag={selectTag} selected={checkTag('HTML')} />
            <Tag tagName='CSS' selectTag={selectTag} selected={checkTag('CSS')} />
            <Tag tagName='JavaScript' selectTag={selectTag} selected={checkTag('JavaScript')} />
            <Tag tagName='React' selectTag={selectTag} selected={checkTag('React')} />
          </div>

          <div>
            <select
              name='status'
              value={taskData.status}
              className='task_status'
              onChange={handleChange}
              disabled={taskData.status === 'done'} // Disable status change if the task is marked as 'Done'
            >
              <option value='todo'>To do</option>
              <option value='doing'>Doing</option>
              <option value='done'>Done</option>
            </select>
            <button
              type='submit'
              className='task_submit'
              disabled={taskData.status === 'done'} // Disable submit button if the task is marked as 'Done'
            >
              {currentTask ? 'Update Task' : '+ Add Task'}
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
