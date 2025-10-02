
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../App.css'; // We'll share styles from App.css

const AuthPage = ({ setAuthToken }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {isLoginView ? (
          <>
            <Login setAuthToken={setAuthToken} />
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <span onClick={() => setIsLoginView(false)}>Register</span>
            </p>
          </>
        ) : (
          <>
            <Register setAuthToken={setAuthToken} />
            <p className="auth-switch-text">
              Already have an account?{' '}
              <span onClick={() => setIsLoginView(true)}>Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;