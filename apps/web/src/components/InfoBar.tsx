import type React from "react";

const InfoBar: React.FC = () => (
  <div className="w-full bg-[#5D20D3] text-white text-xs text-center py-1 font-medium tracking-tight">
    Currently running on Sui Testnet. Please wait for the Sui Mainnet release.
  </div>
);

export default InfoBar;
