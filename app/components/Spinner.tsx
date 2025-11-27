"use client";

import { PropagateLoader } from "react-spinners";

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function Spinner({
  className = "min-h-[50vh] flex items-center justify-center",
  size = 15,
  color = "#ffffff"
}: SpinnerProps) {
  return (
    <div className={className}>
      <PropagateLoader color={color} size={size} />
    </div>
  );
}
