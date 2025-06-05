export default function SquareWordmarkLogo() {
  return (
    <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg bg-black shadow-lg">
      <span
        className="font-extrabold font-satoshi text-6xl text-white italic [transform:scaleX(0.8)]"
        style={{
          WebkitTextStroke: "6px #9400D3",
          WebkitTextFillColor: "#fff",
          paintOrder: "stroke fill",
        }}
      >
        BUMP
      </span>
      <span className="ml-12 font-extrabold font-satoshi text-6xl text-[#FED201] italic [transform:scaleX(0.8)]">
        .WIN
      </span>
    </div>
  );
}
