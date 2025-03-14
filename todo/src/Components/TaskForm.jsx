import React, { useState, useEffect } from 'react';
import './TaskForm.css';
import Tag from './Tag';

const TaskForm = ({ setTasks }) => {
  const [taskData, setTaskData] = useState({
    task: '',
    status: 'todo',
    tags: [],
  });

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
    // Send new task to the backend
    const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });

    const newTask = await response.json();
    setTasks((prev) => [...prev, newTask]);
    setTaskData({ task: '', status: 'todo', tags: [] });
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
            >
              <option value='todo'>To do</option>
              <option value='doing'>Doing</option>
              <option value='done'>Done</option>
            </select>
            <></>
            <button type='submit' className='task_submit'>
              + Add Task
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
