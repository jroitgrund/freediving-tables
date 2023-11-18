import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useEventListener } from "usehooks-ts";

import {
  OneBreathTableViewModel,
  useOneBreathTable,
} from "../lib/useOneBreathTable";
import { displaySeconds } from "../lib/util";
import Button from "./Button";
import Input from "./Input";

export default function OneBreath() {
  const [seconds, setSeconds] = useState<number | undefined>(undefined);

  return (
    <div className="flex grow flex-col px-3">
      <div className="flex justify-end py-3">
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
      <div className="flex grow items-center justify-center">
        {seconds == null ? (
          <OneBreathInput setSeconds={setSeconds} />
        ) : (
          <OneBreathRunningContainer seconds={seconds} />
        )}
      </div>
    </div>
  );
}

function OneBreathInput({
  setSeconds,
}: {
  setSeconds: (seconds: number) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    [setInputValue],
  );
  const onClick = useCallback(
    () => setSeconds(Number(inputValue)),
    [inputValue, setSeconds],
  );
  const disabled = useMemo(
    () => /^[0-9]+$/.exec(inputValue) == null,
    [inputValue],
  );

  return (
    <div className="flex grow flex-col gap-2 p-10">
      <Input description="Seconds" onChange={onChange} />
      <Button onClick={onClick} disabled={disabled}>
        Go
      </Button>
    </div>
  );
}

function OneBreathRunningContainer({ seconds }: { seconds: number }) {
  const { kill, tap, viewModel } = useOneBreathTable(seconds);
  return <OneBreathRunning kill={kill} tap={tap} viewModel={viewModel} />;
}

export function OneBreathRunning({
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
    <div className="flex grow self-stretch" ref={ref}>
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
  );
}

function TapToStart() {
  return (
    <section className="grow self-center text-center text-4xl font-semibold text-teal-300">
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
