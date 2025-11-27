"use client";

import { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { usePathname } from "next/navigation";

export default function ClientLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Function to handle page load
    const handleLoad = () => {
      setLoading(false);
    };

    // Check if document is already loaded
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      // Listen for the load event (wait for all resources including images)
      window.addEventListener("load", handleLoad);
    }

    // Cleanup listener
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Optional: If we wanted to trigger on route change, we could use pathname.
  // But "wait for resources" on route change is tricky in SPA.
  // For now, we stick to the initial load which guarantees "all resources and images" are loaded.

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <PropagateLoader color="#ffffff" size={20} />
      </div>
    );
  }

  return <>{children}</>;
}
