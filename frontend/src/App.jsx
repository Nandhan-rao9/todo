import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_URL}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error("There was an error fetching the todos!", error);
      }
    };

    fetchTodos();
  }, []); 

  // --- REAL API Functions ---

  const addTodo = async () => {
    if (!newTodoContent.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/todos`, { content: newTodoContent });
      setTodos([...todos, response.data]);
      setNewTodoContent(''); 
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id, is_completed) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, { is_completed: !is_completed });
      setTodos(todos.map(todo =>
        todo.id === id ? response.data : todo
      ));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // DELETE request to remove the todo
      await axios.delete(`${API_URL}/todos/${id}`);
      // Filter out the deleted todo from our state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };


  // --- Render function (No changes needed here) ---
  return (
    <div className="app-container">
      <h1>Pro To-Do App</h1>
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
          <li key={todo.id} className={todo.is_completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id, todo.is_completed)}>
              {todo.content}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;