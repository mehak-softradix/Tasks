"use client"
import React, { useEffect, useRef, type ReactNode } from "react";

interface ScreenDragProps {
  children: ReactNode;
  className?: string;
}

const ScreenDrag = ({ children, className = "" }: ScreenDragProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('[draggable="true"]')) return;

      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startScrollLeftRef.current = el.scrollLeft;
      el.style.cursor = "cursor-pointer";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const walk = e.clientX - startXRef.current;
      el.scrollLeft = startScrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      el.style.cursor = "cursor-pointer";
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].pageX;
      startScrollLeftRef.current = el.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const x = e.touches[0].pageX;
      const walk = x - startXRef.current;
      el.scrollLeft = startScrollLeftRef.current - walk;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 overflow-x-auto overflow-y-hidden cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default ScreenDrag;