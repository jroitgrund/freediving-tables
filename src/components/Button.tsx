import classNames from "classnames";
import { ComponentProps } from "react";

export default function Button({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={classNames(
        "flex grow justify-center rounded bg-teal-300 p-2 text-black shadow-md disabled:bg-gray-400",
        className || "",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
