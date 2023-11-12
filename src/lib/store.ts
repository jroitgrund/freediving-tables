import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Store {
  relaxationTables: Array<{ date: Date; times: number[] }>;
}

export const useTablesStore = create<Store>()(
  persist(
    immer((_set) => {
      return {
        relaxationTables: [],
      };
    }),
    { name: "tables-storage" },
  ),
);

export function addRelaxationTable(date: Date, times: number[]) {
  useTablesStore.setState((state) => {
    state.relaxationTables.push({ date, times });
  });
}
