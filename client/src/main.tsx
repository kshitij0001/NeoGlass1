import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDebugFeatures } from "./lib/debug";
import "./lib/notification-init"; // Initialize notifications on app startup

// The starfield background is now handled purely by CSS animations

// Enable debug features if in debug mode
enableDebugFeatures();

createRoot(document.getElementById("root")!).render(<App />);
