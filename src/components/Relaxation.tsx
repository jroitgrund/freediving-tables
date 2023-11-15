import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEventListener } from "usehooks-ts";

import { addRelaxationTable } from "../lib/store";
import { RelaxationTableViewModel } from "../lib/useRelaxationTable";
import { displaySeconds } from "../lib/util";
import Button from "./Button";

export default function Relaxation({
  kill,
  tap,
  viewModel,
}: {
  kill: () => void;
  tap: () => void;
  viewModel: RelaxationTableViewModel;
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
            times={viewModel.times}
          />
        ) : null}
        {viewModel.status === "holding" ? (
          <Holding held={viewModel.secondsHeld} times={viewModel.times} />
        ) : null}
        {viewModel.status === "done" ? <Done times={viewModel.times} /> : null}
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
  times,
}: {
  secondsLeft: number;
  times: number[];
}) {
  return (
    <div className="flex grow flex-col self-stretch">
      <section className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {times.length + 1}
      </section>
      <section className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </section>
      <section className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(secondsLeft)}
      </section>
    </div>
  );
}

function Holding({ held, times }: { held: number; times: number[] }) {
  return (
    <div className="flex grow flex-col self-stretch">
      <section className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {times.length + 1}
      </section>
      <section className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </section>
      <section className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(held)}
      </section>
    </div>
  );
}

function Done({ times }: { times: number[] }) {
  const navigate = useNavigate();

  const cancel = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const save = useCallback(() => {
    addRelaxationTable(new Date(), times);
    navigate("/");
  }, [times, navigate]);

  return (
    <div className="flex grow flex-col self-stretch">
      <section className="flex justify-center text-2xl font-semibold text-teal-200">
        Done
      </section>
      <section className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </section>
      <section className="flex grow flex-col items-center justify-center gap-2">
        <Button className="w-full text-2xl" onClick={save}>
          Save
        </Button>
        <Button className="w-full text-2xl" onClick={cancel}>
          Cancel
        </Button>
      </section>
    </div>
  );
}
