// frontend/src/components/TodoItem.jsx

import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  // Helper to format date nicely, returns empty string if no date
  const formattedDate = todo.due_date 
    ? new Date(todo.due_date).toLocaleDateString() 
    : '';

  return (
    <li className={`todo-item ${todo.is_completed ? 'completed' : ''} priority-${todo.priority?.toLowerCase()}`}>
      <div className="todo-content" onClick={() => onToggle(todo.todo_id, todo.is_completed)}>
        <span>{todo.content}</span>
        <div className="todo-details">
          <span className="priority-badge">{todo.priority}</span>
          {formattedDate && <span className="due-date">{formattedDate}</span>}
        </div>
      </div>
      <button onClick={() => onDelete(todo.todo_id)} className="delete-btn">
        &times;
      </button>
    </li>
  );
};

export default TodoItem;