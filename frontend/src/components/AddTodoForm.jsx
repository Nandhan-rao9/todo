// frontend/src/components/AddTodoForm.jsx

import React, { useState } from 'react';

const AddTodoForm = ({ onAddTodo }) => {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!content.trim()) return;
    onAddTodo({ content, dueDate, priority });
    setContent('');
    setDueDate('');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What needs to be done?"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add To-Do</button>
    </form>
  );
};

export default AddTodoForm;