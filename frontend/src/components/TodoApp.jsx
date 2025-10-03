// frontend/src/components/TodoApp.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import AddTodoForm from './AddTodoForm';
import TodoItem from './TodoItem';
import './styles/TodoApp.css';

const TodoApp = ({ handleLogout }) => {
  const [todos, setTodos] = useState([]);
  // --- NEW: State to track the current sort order ---
  const [sortBy, setSortBy] = useState('default'); 

  // --- MODIFIED: useEffect now depends on 'sortBy' ---
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // Pass the sortBy state as a query parameter to the API
        const response = await api.get(`/todos?sort=${sortBy}`);
        setTodos(response.data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, [sortBy]); // Re-run this effect whenever sortBy changes

  const addTodo = async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      // After adding, refresh the list to maintain sort order
      setSortBy('default'); // Or refetch based on current sort
      setTodos([...todos, response.data]); // Simple add for now
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id, is_completed) => {
    try {
      const response = await api.put(`/todos/${id}`, { is_completed: !is_completed });
      setTodos(todos.map(todo => (todo.todo_id === id ? response.data : todo)));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>My To-Do List</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <AddTodoForm onAddTodo={addTodo} />
      
      {/* --- NEW: UI for sorting controls --- */}
      <div className="filter-controls">
        <span>Sort by:</span>
        <button onClick={() => setSortBy('default')} className={sortBy === 'default' ? 'active' : ''}>Default</button>
        <button onClick={() => setSortBy('due_date')} className={sortBy === 'due_date' ? 'active' : ''}>Due Date</button>
        <button onClick={() => setSortBy('priority')} className={sortBy === 'priority' ? 'active' : ''}>Priority</button>
      </div>
      
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem 
            key={todo.todo_id} 
            todo={todo} 
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;