import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TextEditor from './components/TextEditor';
import Dashboard from './components/Dashboard';
import BlogDetails from './components/BlogDetails';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Editor</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TextEditor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}
