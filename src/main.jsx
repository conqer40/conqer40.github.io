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
import "./creator-home.css";
import "./creator-premium.css";
import "./creator-fix.css";
import "./unified-premium.css";
import "./experience-v2.css";
import "./content-enhancements.css";
import "./navigation-v3.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
