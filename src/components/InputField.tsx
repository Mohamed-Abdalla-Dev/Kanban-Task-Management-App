import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  register,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-medium tracking-wide">
        <label
          className={`text-xs font-bold uppercase ${error ? "text-red" : "text-text-muted-light dark:text-text-muted-dark"}`}
        >
          {label}
        </label>
        {error && (
          <span className="text-red font-semibold text-[10px]">{error}</span>
        )}
      </div>
      <input
        {...register}
        {...props}
        className={`w-full text-sm font-medium px-4 py-2.5 rounded border bg-transparent outline-none transition-colors placeholder:text-text-main-light/25 dark:placeholder:text-text-main-dark/25 ${
          error
            ? "border-red"
            : "border-input-border-light dark:border-input-border-dark hover:border-primary focus:border-primary"
        }`}
      />
    </div>
  );
};
