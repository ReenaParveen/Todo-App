import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa'; // FontAwesome pen icon
import './TaskCard.css';
import Tag from './Tag';

const TaskCard = ({ task, setActiveCard, handleUpdate, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task.title); // Initial task title

  const isDraggable = task.status !== 'done'; // Prevent dragging if the task is done

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleTaskUpdate = () => {
    handleUpdate(task._id, editedTask); // Update task with the edited title
    setIsEditing(false);
  };

  const onDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id); // Set taskId in drag data
    setActiveCard(task); // Set the active task being dragged
  };

  return (
    <article
      className='task_card'
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={() => setActiveCard(null)} // Reset the active card after drop
    >
      {isEditing ? (
        <input
          type="text"
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          onBlur={handleTaskUpdate} // Save when editing is done
          autoFocus
        />
      ) : (
        <p className='task_text'>{task.title}</p>
      )}

      <div className='task_card_bottom_line'>
        <div className='task_card_tags'>
          {task.tags.map((tag, index) => (
            <Tag key={index} tagName={tag} selected />
          ))}
        </div>
        <div className='task_actions'>
          <FaPen onClick={toggleEdit} style={{ cursor: 'pointer', marginRight: '10px' }} />
          <div className='task_delete' onClick={() => handleDelete(task._id)}>
            <i className='fa-solid fa-trash'></i>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
