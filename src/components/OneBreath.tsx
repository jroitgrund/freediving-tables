import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEventListener } from "usehooks-ts";

import {
  OneBreathTableViewModel,
  useOneBreathTable,
} from "../lib/useOneBreathTable";
import { displaySeconds } from "../lib/util";
import Button from "./Button";
import Input from "./Input";
import TopBar from "./TopBar";

export default function OneBreath() {
  const [seconds, setSeconds] = useState<number | undefined>(undefined);

  return (
    <>
      <TopBar />
      <div className="flex grow">
        {seconds == null ? (
          <OneBreathInput setSeconds={setSeconds} />
        ) : (
          <OneBreathRunningContainer seconds={seconds} />
        )}
      </div>
    </>
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
    <div className="flex grow flex-col gap-2 self-center">
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
    <div className="flex grow" ref={ref}>
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
    <div className="flex grow justify-center self-center text-4xl font-semibold text-teal-300">
      tap anywhere to start
    </div>
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
    <div className="flex grow flex-col">
      <div className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {tablesDone + 1}
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(secondsLeft)}
      </div>
    </div>
  );
}

function Holding({ held, tablesDone }: { held: number; tablesDone: number }) {
  return (
    <div className="flex grow flex-col">
      <div className="flex justify-center text-2xl font-semibold text-teal-200">
        Hold {tablesDone + 1}
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold text-teal-300">
        {displaySeconds(held)}
      </div>
    </div>
  );
}

function Done() {
  return (
    <div className="flex grow items-center justify-center text-4xl font-semibold text-teal-200">
      Done
    </div>
  );
}
