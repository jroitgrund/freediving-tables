import { Link } from "react-router-dom";

import Button from "../components/Button";

export default function Home() {
  return (
    <div className="flex grow flex-col">
      <h1 className="flex justify-center text-4xl font-semibold text-teal-300">
        Freediving Trainer
      </h1>
      <ul className="flex grow flex-col justify-center gap-5">
        <li>
          <Link to="/relaxation">
            <Button className="w-full text-2xl">Relaxation Table</Button>
          </Link>
        </li>
        <li>
          <Link to="/one-breath">
            <Button className="w-full text-2xl">One Breath Table</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
