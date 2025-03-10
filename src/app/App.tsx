import "./globals.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
};

export default App;
