const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        dark: "bg-black/20 backdrop-blur-sm border border-[#23262F]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
