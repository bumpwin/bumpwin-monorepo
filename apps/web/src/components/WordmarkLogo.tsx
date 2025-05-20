"use client";

import React from "react"

type WordmarkLogoProps = {
  marginLeft?: string,
  textSize?: string,
  dotMarginRight?: string,
  shadowColor?: string,
}

export default function WordmarkLogo({ marginLeft = "-3px", textSize = "1.1em", dotMarginRight = "-24px", shadowColor = "#9400D3" }: WordmarkLogoProps) {
  const bumpShadow = `6px 6px 0 ${shadowColor}, -6px -6px 0 ${shadowColor}, 6px -6px 0 ${shadowColor}, -6px 6px 0 ${shadowColor}`
  return (
    <h1
      className="text-6xl font-satoshi font-extrabold italic [transform:scaleX(0.8)] group"
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <style jsx>{`
        @keyframes shake {
          0% { transform: scaleX(0.8) rotate(0deg); }
          25% { transform: scaleX(0.8) rotate(2deg); }
          50% { transform: scaleX(0.8) rotate(-2deg); }
          75% { transform: scaleX(0.8) rotate(1deg); }
          100% { transform: scaleX(0.8) rotate(0deg); }
        }
        .wordmark-container:hover {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      <div className="wordmark-container">
        <span className="text-white" style={{ textShadow: bumpShadow }}>BUMP</span>
        <span className="text-[#FED201] relative top-[4px]" style={{ marginLeft, fontSize: textSize }}>
          <span style={{ marginRight: dotMarginRight }}>. </span>
          <span>WIN</span>
        </span>
      </div>
    </h1>
  )
}