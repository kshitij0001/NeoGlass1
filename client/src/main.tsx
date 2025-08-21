import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDebugFeatures } from "./lib/debug";

// The starfield background is now handled purely by CSS animations

// Enable debug features if in debug mode
enableDebugFeatures();

createRoot(document.getElementById("root")!).render(<App />);
