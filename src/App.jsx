import { useState } from "react";
import "./App.css";
import Login from "./Pages/Login";

function App() {
  return (
    <>
      <div
        className="relative w-full h-screen bg-cover bg-center bg-gray-800 filter grayscale bg-image"
      >
        <Login />
      </div>
    </>
  );
}

export default App;
