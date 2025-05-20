import React from "react"

type WordmarkLogoProps = {
  marginLeft?: string,
  textSize?: string,
  dotMarginRight?: string,
  shadowColor?: string,
}

export default function WordmarkLogo({ marginLeft = "-3px", textSize = "1.2em", dotMarginRight = "-24px", shadowColor = "#9400D3" }: WordmarkLogoProps) {
  const bumpShadow = `6px 6px 0 ${shadowColor}, -6px -6px 0 ${shadowColor}, 6px -6px 0 ${shadowColor}, -6px 6px 0 ${shadowColor}`
  return (
    <h1 className="text-6xl font-satoshi font-extrabold italic [transform:scaleX(0.8)]">
      <span className="text-white" style={{ textShadow: bumpShadow }}>BUMP</span>
      <span className="text-[#FED201] relative top-[4px]" style={{ marginLeft, fontSize: textSize }}>
        <span style={{ marginRight: dotMarginRight }}>. </span>
        <span>WIN</span>
      </span>
    </h1>
  )
}