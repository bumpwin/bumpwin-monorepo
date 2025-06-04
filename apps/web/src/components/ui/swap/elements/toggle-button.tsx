import type { ComponentType, ToggleSide } from "@/components/ui/swap/elements/types";

interface ToggleButtonProps {
  activeSide: ToggleSide;
  onChange: (side: ToggleSide) => void;
  secondaryOption: "sell" | "switch";
  secondaryColor?: "red" | "violet" | "purple";
  componentType?: ComponentType;
}

export const ToggleButton = ({
  activeSide,
  onChange,
  secondaryOption,
  secondaryColor = "red",
  componentType = "daytime",
}: ToggleButtonProps) => {
  // Map color names to their Tailwind classes
  const colorMap = {
    red: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
    violet: "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30",
    purple: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
  };

  // Get hover classes for secondary option
  const secondaryHoverClasses = {
    red: "hover:bg-red-500/20 hover:text-red-400",
    violet: "hover:bg-violet-500/20 hover:text-violet-300",
    purple: "hover:bg-purple-500/20 hover:text-purple-400",
  };

  // Get background color based on component type
  const getBackgroundColor = () => {
    if (componentType === "darknight") {
      return "bg-[#16192C]";
    }
    return "bg-[#131620]";
  };

  const secondaryActiveClass = colorMap[secondaryColor];
  const secondaryHoverClass = secondaryHoverClasses[secondaryColor];

  return (
    <div className={`mb-3 flex p-1 ${getBackgroundColor()} rounded-full`}>
      <button
        type="button"
        onClick={() => onChange("buy")}
        className={`flex-1 rounded-full py-2 font-bold text-base transition-all duration-200 ${
          activeSide === "buy"
            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
            : "text-gray-400 hover:bg-green-500/20 hover:text-green-400"
        }`}
      >
        Buy
      </button>
      <button
        type="button"
        onClick={() => onChange(secondaryOption)}
        className={`flex-1 rounded-full py-2 font-bold text-base transition-all duration-200 ${
          activeSide === secondaryOption
            ? secondaryActiveClass
            : `text-gray-400 ${secondaryHoverClass}`
        }`}
      >
        {secondaryOption === "sell" ? "Sell" : "Switch"}
      </button>
    </div>
  );
};
