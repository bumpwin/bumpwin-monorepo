import React from "react";

export default function SquareWordmarkLogo() {
  return (
    <div className="bg-black w-64 h-64 flex flex-col justify-center items-center rounded-lg shadow-lg">
      <span
        className="text-white text-6xl font-satoshi font-extrabold italic [transform:scaleX(0.8)]"
        style={{
          WebkitTextStroke: "6px #9400D3",
          WebkitTextFillColor: "#fff",
          paintOrder: "stroke fill",
        }}
      >
        BUMP
      </span>
      <span className="text-[#FED201] text-6xl font-satoshi font-extrabold italic ml-12 [transform:scaleX(0.8)]">
        .WIN
      </span>
    </div>
  );
}
