import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// The starfield background is now handled purely by CSS animations

createRoot(document.getElementById("root")!).render(<App />);
