import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import InitialFunds from "./pages/InitialFunds";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/initial-funds" element={<InitialFunds />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;