import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function SplitText({ text, className }) {

  const textRef = useRef(null);

  useEffect(() => {

    const letters = textRef.current.querySelectorAll("span");

    gsap.fromTo(
      letters,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.out"
      }
    );

  }, []);

  return (
    <h1 ref={textRef} className={className}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}