// frontend/src/App.jsx

import { useState } from 'react';
import './App.css';
import AuthPage from './components/AuthPage';
import TodoApp from './components/TodoApp';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  return (
    <div>
      {authToken ? (
        <TodoApp handleLogout={handleLogout} />
      ) : (
        <AuthPage setAuthToken={setAuthToken} />
      )}
    </div>
  );
}

export default App;