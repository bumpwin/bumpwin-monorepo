import type { ComponentType, ToggleSide } from "@/components/ui/swap/elements/types";
import { match } from "ts-pattern";

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
  // Get styles based on color and component type using pattern matching
  const getColorClasses = (isActive: boolean) => {
    return match({ color: secondaryColor, isActive })
      .with({ color: "red", isActive: true }, () => "bg-red-500/20 text-red-400 hover:bg-red-500/30")
      .with({ color: "red", isActive: false }, () => "hover:bg-red-500/20 hover:text-red-400")
      .with({ color: "violet", isActive: true }, () => "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30")
      .with({ color: "violet", isActive: false }, () => "hover:bg-violet-500/20 hover:text-violet-300")
      .with({ color: "purple", isActive: true }, () => "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30")
      .with({ color: "purple", isActive: false }, () => "hover:bg-purple-500/20 hover:text-purple-400")
      .exhaustive();
  };

  const getBackgroundColor = () => {
    return match(componentType)
      .with("darknight", () => "bg-[#16192C]")
      .otherwise(() => "bg-[#131620]");
  };

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
            ? getColorClasses(true)
            : `text-gray-400 ${getColorClasses(false)}`
        }`}
      >
        {secondaryOption === "sell" ? "Sell" : "Switch"}
      </button>
    </div>
  );
};
