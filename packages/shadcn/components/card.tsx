const _cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "border-border",
      dark: "border border-[#23262F] bg-black/20 backdrop-blur-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
