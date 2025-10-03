// frontend/src/components/TodoApp.jsx

import React, { useState, useEffect } from 'react';
import api from '../api'; // Use our configured axios instance

const TodoApp = ({ handleLogout }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get('/todos');
        setTodos(response.data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodoContent.trim()) return;
    try {
      const response = await api.post('/todos', { content: newTodoContent });
      setTodos([...todos, response.data]);
      setNewTodoContent('');
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
      <div className="add-todo-form">
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="What needs to be done?"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add To-Do</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.todo_id} className={todo.is_completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.todo_id, todo.is_completed)}>
              {todo.content}
            </span>
            <button onClick={() => deleteTodo(todo.todo_id)} className="delete-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;