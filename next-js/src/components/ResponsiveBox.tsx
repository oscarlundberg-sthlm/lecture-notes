"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
  children: React.ReactNode | ((width: number) => React.ReactNode);
}

export default function ResponsiveBox({ className, children }: Props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {typeof children === "function" ? children(width) : children}
    </div>
  );
}
