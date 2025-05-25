import type React from "react";

import { useState, useEffect } from "react";
import "./ResponsiveContainer.css";

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export function ResponsiveContainer({ children }: ResponsiveContainerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if viewport is mobile width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={"responsive-container"}>
      <div className={`${"contentWrapper"} ${isMobile ? "mobile" : "desktop"}`}>
        <div className={"responsive-content"}>
          {/* Optional: Display current mode */}
          <div className={"viewportIndicator"}>
            {isMobile ? "Mobile View" : "Desktop View"}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
