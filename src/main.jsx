import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./mobile.css";
import "./catalog.css";
import "./pages.css";
import "./details.css";
import "./portfolio.css";
import "./redesign.css";
import "./library.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
