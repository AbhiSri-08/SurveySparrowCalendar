import React from "react";
import ReactDOM from "react-dom/client";
import CalendarApp from "./CalendarApp";  // Make sure this matches the file name exactly
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CalendarApp />
  </React.StrictMode>
);
