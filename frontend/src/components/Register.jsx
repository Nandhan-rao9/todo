// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios

// eslint-disable-next-line no-unused-vars
const Register = ({ setAuthToken}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      
      alert(response.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
        console.error("Registration error:", err.response.data.error);
      } else {
        setError("An unknown error occurred during registration.");
        console.error("Registration error:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;