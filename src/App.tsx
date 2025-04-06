import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Signup } from './pages/sign up';
import { Login } from './pages/login';
import Dashboard from './pages/Dashboard';
import GoalForm from './pages/GoalForm';
import User  from './pages/User';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/goalform" element={<GoalForm />} />
      <Route path="/User" element={<User />} />
    </Routes>
  );
}

export default App;
