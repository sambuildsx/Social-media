import { useEffect, useState } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-6 h-6 rounded-full mix-blend-screen pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0) scale(${
            isHovering ? 1.5 : 1
          })`,
          backgroundColor: "rgba(6, 182, 212, 0.5)",
          boxShadow: "0 0 15px 4px rgba(6, 182, 212, 0.4)",
        }}
      />
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          backgroundColor: "#fff",
          boxShadow: "0 0 10px 2px #fff",
        }}
      />
    </>
  );
}
