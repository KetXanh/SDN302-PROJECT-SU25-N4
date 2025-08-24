import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import AppRoute from "./AppRoute"
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <AppRoute />
      </Router>
    </AuthProvider>
  );
}

export default App;
