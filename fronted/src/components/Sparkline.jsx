import React, { useRef, useEffect } from "react";

export default function Sparkline({ data, color }) {
  const canvasRef = useRef();

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    const w = c.width;
    const h = c.height;

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);

    const scaleX = w / (data.length - 1);
    const scaleY = (max - min) === 0 ? 1 : h / (max - min);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;

    data.forEach((v, i) => {
      const x = i * scaleX;
      const y = h - (v - min) * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={40}
      style={{ display: "block" }}
    />
  );
}
