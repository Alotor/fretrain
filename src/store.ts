import { useCallback, useReducer } from 'react';
import { StringNotes } from "./constants.ts";
import { produce } from "immer";

export type StringState = 'ok' | 'fail' | 'next' | 'pending';
export type Store = {
  selectedNote: string;
  selectedString: number;
  selectedStringProgress: number;
  stringsState: Record<string, StringState>;
  displayNotes: Set<string>;
};

function initStore(): Store {
  return {
    selectedNote: "C",
    selectedString: 1,
    selectedStringProgress: 0,
    stringsState: {
      6: 'pending',
      5: 'pending',
      4: 'pending',
      3: 'pending',
      2: 'pending',
      1: 'pending',
    },
    displayNotes: new Set()
  };
}
export type StoreAction =
  | { type: "select-note"; note: string }
  | { type: "select-string"; string: number }
  | { type: "update-string-progress"; progress: number }
  | { type: "update-string-state"; string: number; status: 'ok' | 'fail' }
  | { type: "clear-strings-state" }
  | { type: "display-correct"; string: number }
  | { type: "reset" };

export function useStore() {
  const reducer = useCallback(produce((store: Store, action: StoreAction) => {
    if (action.type === "select-note") {
      store.selectedNote = action.note;
    } else if (action.type === "select-string"){
      store.selectedString = action.string;
      store.selectedStringProgress = 0;
      store.stringsState[action.string] = "next";
    } else if (action.type === "update-string-progress") {
      store.selectedStringProgress = action.progress;
    } else if (action.type === "update-string-state") {
      store.stringsState[action.string] = action.status;
    } else if (action.type === "clear-strings-state") {
      store.selectedStringProgress = 0;
      for (let i=1; i<=6; i++) {
        store.stringsState[i] = 'pending';
      }
      store.displayNotes = new Set();
    } else if (action.type === "display-correct") {
      const sstr = store.selectedString;
      const ks: Array<string> = Object.keys(StringNotes[sstr]);
      const idx = ks.find((k) => new Set(StringNotes[sstr][k]).has(store.selectedNote));
      const displayCoord = `${sstr},${idx}`;
      store.displayNotes.add(displayCoord);
    } else if (action.type === "reset") {
      return initStore();
    }
  }), []);

  return useReducer(reducer, initStore());
}
