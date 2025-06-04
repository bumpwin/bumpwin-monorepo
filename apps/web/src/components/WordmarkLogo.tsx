"use client";

type WordmarkLogoProps = {
  marginLeft?: string;
  textSize?: string;
  dotMarginRight?: string;
  shadowColor?: string;
  containerClass?: string;
};

export default function WordmarkLogo({
  marginLeft = "-3px",
  textSize = "1.12em",
  dotMarginRight = "-5px",
  shadowColor = "#9400D3",
  containerClass = "",
}: WordmarkLogoProps) {
  const bumpShadow = `6px 6px 0 ${shadowColor}, -6px -6px 0 ${shadowColor}, 6px -6px 0 ${shadowColor}, -6px 6px 0 ${shadowColor}`;
  return (
    <h1
      className={`group font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)] ${containerClass}`}
      style={{
        position: "relative",
        display: "inline-block",
        width: "max-content", // Prevent overflow without changing the layout
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
        <span className="text-white" style={{ textShadow: bumpShadow }}>
          BUMP
        </span>
        <span
          className="relative top-[4px] text-[#FED201]"
          style={{ marginLeft, fontSize: textSize }}
        >
          <span style={{ marginRight: dotMarginRight }}>.</span>
          <span>WIN</span>
        </span>
      </div>
    </h1>
  );
}
