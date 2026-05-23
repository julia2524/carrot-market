import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps & InputHTMLAttributes<HTMLInputElement>
>(({ errors = [], name, ...rest }, ref) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          className="bg-transparent rounded-md w-full h-10 focus:outline-none border-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-500"
          name={name}
          {...rest}
        />
        {errors.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
      </div>
    </>
  );
});

Input.displayName = "Input";
export default Input;
