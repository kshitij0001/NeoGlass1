
import { useEffect, useRef } from "react";

interface GenerativeBackgroundProps {
  refreshSeed?: boolean;
}

export function GenerativeBackground({
  refreshSeed = false,
}: GenerativeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Clear container
    container.innerHTML = "";

    // Create the grid
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(15, 1fr)";
    grid.style.gridTemplateRows = "repeat(15, 1fr)";
    grid.style.height = "100vh";
    grid.style.width = "100vw";
    grid.style.gap = "0";

    container.appendChild(grid);

    const colors = ['#d63230', '#f7d002', '#1A53C0', '#000000', '#13d3c0', '#f23d21', '#1397d8', '#CD417E', '#f595ad'];

    // Generate 15x15 grid cells (225 total)
    for (let i = 0; i < 225; i++) {
      const cell = document.createElement("div");
      cell.style.position = "relative";
      cell.style.overflow = "hidden";
      cell.style.border = "1px solid rgba(0,0,0,0.1)";
      cell.style.background = "#ffffff";

      // Create two circles per cell
      for (let j = 0; j < 2; j++) {
        const circle = document.createElement("div");
        circle.style.position = "absolute";
        circle.style.width = "40%";
        circle.style.height = "40%";
        circle.style.borderRadius = "50%";
        circle.style.top = "50%";
        circle.style.left = "50%";
        circle.style.transform = "translate(-50%, -50%)";
        circle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation delay and direction
        const delay = Math.random() * 4;
        const direction = Math.floor(Math.random() * 4); // 0: right, 1: down, 2: left, 3: up
        
        circle.style.animation = `moveCircle${direction} 4s infinite ease-in-out`;
        circle.style.animationDelay = `${delay}s`;
        
        cell.appendChild(circle);
      }

      grid.appendChild(cell);
    }

    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes moveCircle0 {
        0% { transform: translate(-50%, -50%) scaleY(1); }
        25% { transform: translate(100%, -50%) scaleY(0.2); }
        50% { transform: translate(150%, -50%) scaleY(0); }
        75% { transform: translate(100%, -50%) scaleY(0.2); }
        100% { transform: translate(-50%, -50%) scaleY(1); }
      }
      
      @keyframes moveCircle1 {
        0% { transform: translate(-50%, -50%) scaleX(1); }
        25% { transform: translate(-50%, 100%) scaleX(0.2); }
        50% { transform: translate(-50%, 150%) scaleX(0); }
        75% { transform: translate(-50%, 100%) scaleX(0.2); }
        100% { transform: translate(-50%, -50%) scaleX(1); }
      }
      
      @keyframes moveCircle2 {
        0% { transform: translate(-50%, -50%) scaleY(1); }
        25% { transform: translate(-200%, -50%) scaleY(0.2); }
        50% { transform: translate(-250%, -50%) scaleY(0); }
        75% { transform: translate(-200%, -50%) scaleY(0.2); }
        100% { transform: translate(-50%, -50%) scaleY(1); }
      }
      
      @keyframes moveCircle3 {
        0% { transform: translate(-50%, -50%) scaleX(1); }
        25% { transform: translate(-50%, -200%) scaleX(0.2); }
        50% { transform: translate(-50%, -250%) scaleX(0); }
        75% { transform: translate(-50%, -200%) scaleX(0.2); }
        100% { transform: translate(-50%, -50%) scaleX(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      container.innerHTML = "";
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, [refreshSeed]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    />
  );
}

export default GenerativeBackground;
