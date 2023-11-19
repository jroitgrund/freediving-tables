import classNames from "classnames";
import { ComponentProps } from "react";

export default function Input({
  description,
  className,
  ...props
}: ComponentProps<"input"> & { description: string }) {
  return (
    <div className="group relative flex grow">
      <input
        type="text"
        placeholder=""
        className={classNames(
          `color-black peer relative relative mt-2 grow justify-center rounded border bg-black p-2 outline-none transition-all placeholder-shown:border-gray-400 focus-within:text-teal-300 group-focus-within:border-teal-300`,
          className || "",
        )}
        {...props}
      />
      <div className="bord absolute left-1 top-0 z-10 bg-black px-1 text-xs text-teal-300 text-white transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-300">
        {description}
      </div>
    </div>
  );
}
