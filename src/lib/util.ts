import { padStart } from "lodash-es";

import { minutesToSeconds, secondsToMinutes } from "date-fns";

export function minutesAndSeconds(seconds: number) {
  const minutes = secondsToMinutes(seconds);
  return {
    minutes,
    seconds: seconds - minutesToSeconds(minutes),
  };
}

export function displaySeconds(_seconds: number) {
  const { seconds, minutes } = minutesAndSeconds(_seconds);
  return `${padStart(minutes.toString(), 2, "0")}:${padStart(
    seconds.toString(),
    2,
    "0",
  )}`;
}
