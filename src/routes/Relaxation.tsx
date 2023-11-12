"use client";

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useEventListener } from "usehooks-ts";

import { useRelaxationTable } from "../lib/useRelaxationTable";
import { displaySeconds } from "../lib/util";

export default function Relaxation() {
  const { viewModel, tap, kill } = useRelaxationTable();

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
      <div className="flex grow items-center justify-center p-10">
        {viewModel.status === "tap-to-start" ? <TapToStart /> : null}
        {viewModel.status === "breathing-up" ? (
          <BreathingUp secondsLeft={viewModel.secondsLeft} />
        ) : null}
        {viewModel.status === "holding" ? (
          <Holding held={viewModel.secondsHeld} />
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

function BreathingUp({ secondsLeft }: { secondsLeft: number }) {
  return (
    <section className="text-4xl font-semibold text-teal-300">
      {displaySeconds(secondsLeft)}
    </section>
  );
}

function Holding({ held }: { held: number }) {
  return (
    <section className="text-4xl font-semibold text-teal-300">
      {displaySeconds(held)}
    </section>
  );
}

function Done({ times }: { times: number[] }) {
  return (
    <section className="flex-col gap-4">
      <h1 className="text-4xl font-semibold text-teal-300">Done!</h1>
      <ul className="flex-col gap-2">
        {times.map((time, i) => (
          <li key={i}>{displaySeconds(time)}</li>
        ))}
      </ul>
    </section>
  );
}
