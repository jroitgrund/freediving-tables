import classNames from "classnames";

export default function Button({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={classNames(
        "flex justify-center rounded bg-teal-300 p-2 text-black shadow-md",
        className || "",
      )}
    >
      {children}
    </button>
  );
}
