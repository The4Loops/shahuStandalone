import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from './AdminPage';
import './App.css';

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
