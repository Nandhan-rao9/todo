// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios

const Register = ({ setAuthToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Make a POST request to our new backend endpoint
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      
      // On success, show a confirmation and maybe suggest logging in
      alert(response.data.message);
      // You could automatically switch to the login view here if you wanted.

    } catch (err) {
      // If the backend returns an error (like "Username already exists")
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