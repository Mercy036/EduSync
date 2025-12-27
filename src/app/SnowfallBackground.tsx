"use client";

import React from "react";
import Snowfall from "react-snowfall";

export default function SnowfallBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <Snowfall
        color="#d89c57ff" 
        snowflakeCount={40}
        radius={[1.5, 4.0]} 
        wind={[-0.5, 2.0]}
        speed={[1.0, 3.0]}
      />
    </div>
  );
}