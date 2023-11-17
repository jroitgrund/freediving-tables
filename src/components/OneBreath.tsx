import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useEventListener } from "usehooks-ts";

import { OneBreathTableViewModel } from "../lib/useOneBreathTable";
import { displaySeconds } from "../lib/util";

export default function OneBreath({
  kill,
  tap,
  viewModel,
}: {
  kill: () => void;
  tap: () => void;
  viewModel: OneBreathTableViewModel;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      kill();
    },
    [kill],
  );

  useEventListener(
    "click",
    () => {
      tap();
    },
    ref,
  );

  return (
    <div className="flex grow flex-col" ref={ref}>
      <div className="flex justify-end p-3">
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
      <div className="flex grow items-center justify-center px-3">
        {viewModel.status === "tap-to-start" ? <TapToStart /> : null}
        {viewModel.status === "breathing-up" ? (
          <BreathingUp
            secondsLeft={viewModel.secondsLeft}
            tablesDone={viewModel.tablesDone}
          />
        ) : null}
        {viewModel.status === "holding" ? (
          <Holding
            held={viewModel.secondsHeld}
            tablesDone={viewModel.tablesDone}
          />
        ) : null}
        {viewModel.status === "done" ? <Done /> : null}
      </div>
    </div>
  );
}

function TapToStart() {
  return (
    <section className="text-center text-4xl font-semibold text-teal-300">
      tap anywhere to start
    </section>
  );
}

function BreathingUp({
  secondsLeft,
  tablesDone,
}: {
  secondsLeft: number;
  tablesDone: number;
}) {
  return (
    <div className="flex grow flex-col self-stretch">
      <section className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {tablesDone + 1}
      </section>
      <section className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(secondsLeft)}
      </section>
    </div>
  );
}

function Holding({ held, tablesDone }: { held: number; tablesDone: number }) {
  return (
    <div className="flex grow flex-col self-stretch">
      <section className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {tablesDone + 1}
      </section>
      <section className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(held)}
      </section>
    </div>
  );
}

function Done() {
  return (
    <div className="flex grow items-center justify-center self-stretch">
      <section className="text-4xl font-semibold text-teal-200">Done</section>
    </div>
  );
}
