import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEventListener } from "usehooks-ts";

import { addRelaxationTable } from "../lib/store";
import { RelaxationTableViewModel } from "../lib/useRelaxationTable";
import { displaySeconds } from "../lib/util";
import Button from "./Button";
import TopBar from "./TopBar";

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
    <>
      <TopBar />
      <div className="flex grow" ref={ref}>
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
    </>
  );
}

function TapToStart() {
  return (
    <div className="flex justify-center self-center text-4xl font-semibold text-teal-300">
      tap anywhere to start
    </div>
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
    <div className="flex grow flex-col">
      <div className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {times.length + 1}
      </div>
      <div className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(secondsLeft)}
      </div>
    </div>
  );
}

function Holding({ held, times }: { held: number; times: number[] }) {
  return (
    <div className="flex grow flex-col">
      <div className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {times.length + 1}
      </div>
      <div className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(held)}
      </div>
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
    <div className="flex grow flex-col">
      <div className="flex justify-center text-2xl font-semibold text-teal-200">
        Done
      </div>
      <div className="flex flex-wrap gap-x-2 text-lg leading-tight text-teal-200">
        {times.map((time, i) => (
          <div key={i}>{displaySeconds(time)}</div>
        ))}
      </div>
      <div className="flex grow flex-col justify-center gap-2">
        <div className="flex">
          <Button className="text-2xl" onClick={save}>
            Save
          </Button>
        </div>
        <div className="flex">
          <Button className="text-2xl" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
