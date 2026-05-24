import React from "react";
import ReactDOM from "react-dom/client"
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import axios from "axios";

import App from "./App";
import "./index.css";

axios.defaults.baseURL = "http://localhost:5000/api"; 
axios.defaults.withCredentials = true;



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
