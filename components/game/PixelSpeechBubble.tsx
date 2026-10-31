"use client";

interface PixelSpeechBubbleProps {
  x: number;
  y: number;
  text: string;
}

export function PixelSpeechBubble({ x, y, text }: PixelSpeechBubbleProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%)", // Centered horizontally above the target
        backgroundColor: "#F4F2EC", // Main site background color
        color: "#17191B",
        padding: "4px 6px",
        fontFamily: "var(--font-mono)", // Using the site's mono font for text
        fontSize: "8px",
        lineHeight: "1",
        letterSpacing: "-0.5px",
        whiteSpace: "nowrap",
        border: "1px solid #17191B",
        zIndex: 200,
        boxShadow: "2px 2px 0px rgba(23, 25, 27, 0.2)",
      }}
    >
      {text}
      {/* Tiny arrow pointing down */}
      <div
        style={{
          position: "absolute",
          bottom: "-3px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "4px",
          height: "2px",
          backgroundColor: "#F4F2EC",
          borderLeft: "1px solid #17191B",
          borderRight: "1px solid #17191B",
          borderBottom: "1px solid #17191B",
        }}
      />
    </div>
  );
}
