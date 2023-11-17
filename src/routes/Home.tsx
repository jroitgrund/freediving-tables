import { Link } from "react-router-dom";

import Button from "../components/Button";

export default function Home() {
  return (
    <div className="flex grow flex-col p-10">
      <header className="flex justify-center">
        <h1 className="text-4xl font-semibold text-teal-300">
          Freediving Trainer
        </h1>
      </header>
      <main className="flex grow items-center">
        <section className="grow">
          <ul className="flex flex-col items-stretch gap-5 p-10">
            <li className="flex-col items-stretch">
              <Link to="/relaxation">
                <Button className="w-full text-2xl">Relaxation Table</Button>
              </Link>
            </li>
            <li className="flex-col items-stretch">
              <Link to="/one-breath">
                <Button className="w-full text-2xl">One Breath Table</Button>
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
