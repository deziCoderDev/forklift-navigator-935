
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Forçar o dark mode sempre ativo no body
if (typeof document !== "undefined" && !document.body.classList.contains("dark")) {
  document.body.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
