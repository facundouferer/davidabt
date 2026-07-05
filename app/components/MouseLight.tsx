"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MouseLight() {
  const lightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const light = lightRef.current;
    if (!light || pathname.startsWith("/admin")) return;

    const moveLight = (x: number, y: number) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        light.style.setProperty("--mouse-x", `${x}px`);
        light.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      moveLight(event.clientX, event.clientY);
    };

    moveLight(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <div ref={lightRef} className="mouse-light" aria-hidden="true" />;
}
