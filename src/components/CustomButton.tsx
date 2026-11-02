import { Plus } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  hasIcon?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const CustomButton: React.FC<ButtonProps> = ({
  variant = "primary",
  hasIcon = false,
  isLoading = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold text-sm rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary-hover text-white px-6 py-4",
    secondary:
      "mt-1 bg-primary/10 hover:bg-primary/25 text-primary dark:bg-white dark:hover:bg-white/90 dark:text-primary py-2.5",
    danger: " bg-red hover:bg-red-hover text-white py-3 px-6",
  };

  const paddingStyle = hasIcon ? "pl-2 pr-6 py-2 h-12" : "px-6 py-4";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]}  ${paddingStyle} group ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {hasIcon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-primary mr-4 transition-transform group-hover:scale-105">
          <Plus className="text-primary" />
        </span>
      )}
      {children}
    </button>
  );
};
