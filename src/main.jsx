import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Suspense } from "react";

createRoot(document.getElementById("root")).render(
  <Suspense>
    <App />
  </Suspense>
);
