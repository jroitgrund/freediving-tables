import { useCallback, useRef, useState } from "react";

import complete from "../assets/complete.mp3";
import countdown from "../assets/countdown.mp3";

const COUNTDOWN_AUDIO = new Audio(countdown);
const COMPLETE_AUDIO = new Audio(complete);
const NUM_TABLES = 10;

export type OneBreathTableViewModel =
  | { status: "tap-to-start" }
  | {
      status: "breathing-up";
      secondsLeft: number;
      tablesDone: number;
    }
  | {
      status: "holding";
      secondsHeld: number;
      tablesDone: number;
    }
  | { status: "done" };

interface OneBreathTableState {
  tap(
    updateViewModel: (viewModel: OneBreathTableViewModel) => void,
    updateOneBreathTable: (newOneBreathTable: OneBreathTableState) => void,
  ): void;
  kill(): void;
  getViewModel(): OneBreathTableViewModel;
}

class TapToStart implements OneBreathTableState {
  constructor(private readonly seconds: number) {}

  getViewModel = (): OneBreathTableViewModel => ({
    status: "tap-to-start",
  });

  tap = (
    updateViewModel: (viewModel: OneBreathTableViewModel) => void,
    updateRelaxationTable: (newOneBreathTable: OneBreathTableState) => void,
  ) => {
    updateRelaxationTable(
      new BreathingUp(updateViewModel, updateRelaxationTable, this.seconds, 0),
    );
  };

  kill = () => {};
}

class BreathingUp implements OneBreathTableState {
  private secondsLeft = 5;
  private timer: NodeJS.Timeout;

  constructor(
    private readonly updateViewModel: (
      viewModel: OneBreathTableViewModel,
    ) => void,
    private readonly updateRelaxationTable: (
      newOneBreathTable: OneBreathTableState,
    ) => void,
    private readonly seconds: number,
    private readonly tablesDone: number,
  ) {
    this.updateViewModel(this.getViewModel());
    this.timer = setInterval(() => this.countdown(), 1000);
  }

  tap = () => this;

  kill = () => {
    clearInterval(this.timer);
  };

  countdown = () => {
    const secondsLeft = --this.secondsLeft;
    if (secondsLeft === 0) {
      clearInterval(this.timer);
      this.updateRelaxationTable(
        new Holding(
          this.updateViewModel,
          this.updateRelaxationTable,
          this.seconds,
          this.tablesDone,
        ),
      );
    } else {
      this.updateViewModel(this.getViewModel());
    }
  };

  getViewModel = (): OneBreathTableViewModel => ({
    status: "breathing-up",
    secondsLeft: this.secondsLeft,
    tablesDone: this.tablesDone,
  });
}

class Holding implements OneBreathTableState {
  private secondsHeld = 0;
  private timer: NodeJS.Timeout;

  constructor(
    private readonly updateViewModel: (
      viewModel: OneBreathTableViewModel,
    ) => void,
    private readonly updateRelaxationTable: (
      newOneBreathTable: OneBreathTableState,
    ) => void,
    private readonly seconds: number,
    private readonly tablesDone: number,
  ) {
    this.updateViewModel(this.getViewModel());
    this.timer = setInterval(() => this.countUp(), 1000);
  }

  private countUp = () => {
    this.secondsHeld++;
    if (this.secondsHeld === this.seconds) {
      if (this.tablesDone + 1 === NUM_TABLES) {
        this.updateRelaxationTable(new Done(this.updateViewModel));
      } else {
        this.updateRelaxationTable(
          new BreathingUp(
            this.updateViewModel,
            this.updateRelaxationTable,
            this.seconds,
            this.tablesDone + 1,
          ),
        );
      }
    } else if (this.secondsHeld === this.seconds - 10) {
      COUNTDOWN_AUDIO.play();
    }

    this.updateViewModel(this.getViewModel());
  };

  tap = () => {};

  kill = () => {
    clearInterval(this.timer);
    COUNTDOWN_AUDIO.pause();
    COUNTDOWN_AUDIO.currentTime = 0;
  };

  getViewModel = (): OneBreathTableViewModel => ({
    status: "holding",
    secondsHeld: this.secondsHeld,
    tablesDone: this.tablesDone,
  });
}

class Done implements OneBreathTableState {
  constructor(updateViewModel: (viewModel: OneBreathTableViewModel) => void) {
    updateViewModel(this.getViewModel());
    COMPLETE_AUDIO.play();
  }

  tap = (): OneBreathTableState => this;

  kill = () => {
    COMPLETE_AUDIO.pause();
    COMPLETE_AUDIO.currentTime = 0;
  };

  getViewModel = (): OneBreathTableViewModel => ({
    status: "done",
  });
}

export function useOneBreathTable(seconds: number) {
  const oneBreathTable = useRef<OneBreathTableState>(new TapToStart(seconds));
  const setOneBreathTable = useCallback(
    (newOneBreathTable: OneBreathTableState) =>
      (oneBreathTable.current = newOneBreathTable),
    [],
  );
  const wakeLock = useRef(
    navigator.wakeLock != null
      ? navigator.wakeLock.request("screen")
      : undefined,
  );

  const [viewModel, setViewModel] = useState<OneBreathTableViewModel>(
    oneBreathTable.current.getViewModel(),
  );

  const tap = useCallback(() => {
    oneBreathTable.current.tap(setViewModel, setOneBreathTable);
  }, [setOneBreathTable, setViewModel]);

  const kill = useCallback(async () => {
    if (wakeLock.current != null) {
      (await wakeLock.current).release();
    }
    oneBreathTable.current.kill();
  }, []);

  return { viewModel, tap, kill };
}
