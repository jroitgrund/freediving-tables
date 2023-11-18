import { max } from "lodash-es";
import { useCallback, useRef, useState } from "react";

import complete from "../assets/complete.mp3";
import countdown from "../assets/countdown.mp3";

const COUNTDOWN_AUDIO = new Audio(countdown);
const COMPLETE_AUDIO = new Audio(complete);

export type RelaxationTableViewModel =
  | { status: "tap-to-start" }
  | {
      status: "breathing-up";
      secondsLeft: number;
      times: number[];
    }
  | {
      status: "holding";
      secondsHeld: number;
      times: number[];
    }
  | { status: "done"; times: number[] };

interface RelaxationTableState {
  tap(
    updateViewModel: (viewModel: RelaxationTableViewModel) => void,
    updateRelaxationTable: (newRelaxationTable: RelaxationTableState) => void,
  ): void;
  kill(): void;
  getViewModel(): RelaxationTableViewModel;
}

class TapToStart implements RelaxationTableState {
  constructor() {}

  getViewModel = (): RelaxationTableViewModel => ({
    status: "tap-to-start",
  });

  tap = (
    updateViewModel: (viewModel: RelaxationTableViewModel) => void,
    updateRelaxationTable: (newRelaxationTable: RelaxationTableState) => void,
  ) => {
    updateRelaxationTable(
      new BreathingUp(updateViewModel, updateRelaxationTable, []),
    );
  };

  kill = () => {};
}

class BreathingUp implements RelaxationTableState {
  private secondsLeft = import.meta.env.DEV ? 11 : 120;
  private timer: NodeJS.Timeout;

  constructor(
    private readonly updateViewModel: (
      viewModel: RelaxationTableViewModel,
    ) => void,
    private readonly updateRelaxationTable: (
      newRelaxationTable: RelaxationTableState,
    ) => void,
    private readonly times: number[],
  ) {
    this.updateViewModel(this.getViewModel());
    this.timer = setInterval(() => this.countdown(), 1000);
  }

  tap = () => this;

  kill = () => {
    clearInterval(this.timer);
    COUNTDOWN_AUDIO.pause();
    COUNTDOWN_AUDIO.currentTime = 0;
  };

  countdown = () => {
    const secondsLeft = --this.secondsLeft;
    if (secondsLeft === 0) {
      clearInterval(this.timer);
      this.updateRelaxationTable(
        new Holding(
          this.updateViewModel,
          this.updateRelaxationTable,
          this.times,
        ),
      );
    } else if (secondsLeft === 10) {
      COUNTDOWN_AUDIO.play();
    } else {
      this.updateViewModel(this.getViewModel());
    }
  };

  getViewModel = (): RelaxationTableViewModel => ({
    status: "breathing-up",
    secondsLeft: this.secondsLeft,
    times: this.times,
  });
}

class Holding implements RelaxationTableState {
  private secondsHeld = 0;
  private timer: NodeJS.Timeout;

  constructor(
    private readonly updateViewModel: (
      viewModel: RelaxationTableViewModel,
    ) => void,
    private readonly updateRelaxationTable: (
      newRelaxationTable: RelaxationTableState,
    ) => void,
    private readonly times: number[],
  ) {
    this.updateViewModel(this.getViewModel());
    this.timer = setInterval(() => this.countUp(), 1000);
  }

  private countUp = () => {
    this.secondsHeld++;
    this.updateViewModel(this.getViewModel());
  };

  tap = () => {
    clearInterval(this.timer);
    if (this.secondsHeld / (max(this.times) || this.secondsHeld) < 0.9) {
      this.updateRelaxationTable(
        new Done([...this.times, this.secondsHeld], this.updateViewModel),
      );
    } else {
      this.updateRelaxationTable(
        new BreathingUp(this.updateViewModel, this.updateRelaxationTable, [
          ...this.times,
          this.secondsHeld,
        ]),
      );
    }
  };

  kill = () => {
    clearInterval(this.timer);
  };

  getViewModel = (): RelaxationTableViewModel => ({
    status: "holding",
    secondsHeld: this.secondsHeld,
    times: this.times,
  });
}

class Done implements RelaxationTableState {
  constructor(
    private readonly times: number[],
    updateViewModel: (viewModel: RelaxationTableViewModel) => void,
  ) {
    updateViewModel(this.getViewModel());
    COMPLETE_AUDIO.play();
  }

  tap = (): RelaxationTableState => this;

  kill = () => {
    COMPLETE_AUDIO.pause();
    COMPLETE_AUDIO.currentTime = 0;
  };

  getViewModel = (): RelaxationTableViewModel => ({
    times: this.times,
    status: "done",
  });
}

export function useRelaxationTable() {
  const relaxationTable = useRef<RelaxationTableState>(new TapToStart());
  const setRelaxationTable = useCallback(
    (newRelaxationTable: RelaxationTableState) =>
      (relaxationTable.current = newRelaxationTable),
    [],
  );
  const wakeLock = useRef(
    navigator.wakeLock != null
      ? navigator.wakeLock.request("screen")
      : undefined,
  );

  const [viewModel, setViewModel] = useState<RelaxationTableViewModel>(
    relaxationTable.current.getViewModel(),
  );

  const tap = useCallback(() => {
    relaxationTable.current.tap(setViewModel, setRelaxationTable);
  }, [setRelaxationTable, setViewModel]);

  const kill = useCallback(async () => {
    if (wakeLock.current != null) {
      (await wakeLock.current).release();
    }
    relaxationTable.current.kill();
  }, []);

  return { viewModel, tap, kill };
}
