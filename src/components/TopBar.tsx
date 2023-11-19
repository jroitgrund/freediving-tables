import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="absolute left-0 top-0 flex w-screen justify-end p-3 py-3">
      <Link to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Link>
    </div>
  );
}
