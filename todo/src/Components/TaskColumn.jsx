import React from 'react';
import TaskCard from './TaskCard';
import './TaskColumn.css';
import DropArea from './DropArea';

const TaskColumn = ({ title, tasks, status, handleDelete, setActiveCard, onDrop, handleUpdate }) => {
  return (
    <section className='task_column'>
      <h2 className='task_column_heading'>{title}</h2>

      <DropArea onDrop={() => onDrop(status, 0)} />

      {tasks.map(
        (task, index) =>
          task.status === status && (
            <React.Fragment key={index}>
              <TaskCard
                  key={index}
                  title={task.task}
                  tags={task.tags}
                  taskId={task._id}
                  status={task.status}
                  handleDelete={handleDelete}
                  index={index}
                  setActiveCard={setActiveCard}
                  handleUpdate={handleUpdate}
              /> 
              <DropArea onDrop={() => onDrop(status, index + 1)} />
            </React.Fragment>
          )
      )}
    </section>
  );
};

export default TaskColumn;
